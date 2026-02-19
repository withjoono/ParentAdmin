import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TutorService {
    constructor(private prisma: PrismaService) { }

    // ===== HELPER: Hub ID → TbUser 변환 =====
    private async resolveParent(hubId: string) {
        const hubUserId = parseInt(hubId, 10);
        let user = await this.prisma.tbUser.findUnique({
            where: { hubUserId },
        });

        if (!user) {
            user = await this.prisma.tbUser.create({
                data: {
                    hubUserId,
                    username: `parent_${hubId}`,
                    email: `parent_${hubId}@tutorboard.local`,
                    role: 'parent',
                },
            });
        }

        return user;
    }

    // ===== DASHBOARD =====

    async getParentDashboard(hubId: string) {
        const user = await this.resolveParent(hubId);
        const parentId = user.id;

        const enrollments = await this.prisma.tbClassEnrollment.findMany({
            where: { parentId },
            include: {
                student: { select: { id: true, username: true, avatarUrl: true } },
                class: {
                    include: {
                        teacher: { select: { id: true, username: true } },
                        _count: { select: { enrollments: true } },
                    },
                },
            },
        });

        // 자녀별로 그룹화
        const childrenMap = new Map<string, any>();
        for (const enrollment of enrollments) {
            const studentId = enrollment.studentId;
            if (!childrenMap.has(studentId)) {
                childrenMap.set(studentId, {
                    student: enrollment.student,
                    classes: [],
                    todayAttendance: [],
                    pendingAssignments: 0,
                });
            }
            const child = childrenMap.get(studentId);
            child.classes.push({
                id: enrollment.class.id,
                name: enrollment.class.name,
                teacher: enrollment.class.teacher,
            });
        }

        // 각 자녀의 오늘 출결 + 미제출 과제 수
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const [studentId, child] of childrenMap) {
            const [todayAttendance, pendingCount] = await Promise.all([
                this.prisma.tbAttendance.findMany({
                    where: {
                        studentId,
                        date: { gte: today, lt: new Date(today.getTime() + 86400000) },
                    },
                    include: { class: { select: { name: true } } },
                }),
                this.prisma.tbAssignmentSubmission.count({
                    where: {
                        studentId,
                        status: 'pending',
                    },
                }),
            ]);
            child.todayAttendance = todayAttendance;
            child.pendingAssignments = pendingCount;
        }

        return { children: Array.from(childrenMap.values()) };
    }

    // ===== TIMELINE =====

    async getChildTimeline(hubId: string, childId: string, classId?: string) {
        const user = await this.resolveParent(hubId);
        await this.verifyParentChild(user.id, childId);

        const where: any = { studentId: childId };
        if (classId) where.classId = classId;

        // 수업 기록 (LessonRecord + Class)
        const enrollments = await this.prisma.tbClassEnrollment.findMany({
            where: { studentId: childId, parentId: user.id },
            select: { classId: true },
        });
        const classIds = classId ? [classId] : enrollments.map((e) => e.classId);

        const [lessonRecords, testResults, assignments] = await Promise.all([
            this.prisma.tbLessonRecord.findMany({
                where: {
                    lessonPlan: { classId: { in: classIds } },
                },
                include: {
                    lessonPlan: {
                        include: { class: { select: { id: true, name: true } } },
                    },
                },
                orderBy: { recordDate: 'desc' },
                take: 30,
            }),
            this.prisma.tbTestResult.findMany({
                where: {
                    studentId: childId,
                    test: { lesson: { classId: { in: classIds } } },
                },
                include: {
                    test: {
                        include: {
                            lesson: { include: { class: { select: { id: true, name: true } } } },
                        },
                    },
                },
                orderBy: { takenAt: 'desc' },
                take: 20,
            }),
            this.prisma.tbAssignment.findMany({
                where: {
                    lesson: { classId: { in: classIds } },
                },
                include: {
                    lesson: { include: { class: { select: { id: true, name: true } } } },
                    submissions: {
                        where: { studentId: childId },
                        select: { status: true, grade: true, submittedAt: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
                take: 20,
            }),
        ]);

        // 타임라인 형태로 변환
        const timeline: any[] = [];

        for (const record of lessonRecords) {
            timeline.push({
                type: 'lesson',
                date: record.recordDate,
                title: record.lessonPlan.title,
                className: record.lessonPlan.class.name,
                summary: record.summary,
                pages: record.pagesFrom && record.pagesTo ? `${record.pagesFrom}-${record.pagesTo}` : null,
            });
        }

        for (const result of testResults) {
            timeline.push({
                type: 'test',
                date: result.takenAt,
                title: result.test.title,
                className: result.test.lesson.class.name,
                score: result.score,
                maxScore: result.test.maxScore,
                percentage: Math.round((result.score / result.test.maxScore) * 100),
            });
        }

        for (const assignment of assignments) {
            const submission = assignment.submissions[0];
            timeline.push({
                type: 'assignment',
                date: assignment.dueDate || assignment.createdAt,
                title: assignment.title,
                className: assignment.lesson.class.name,
                status: submission?.status || 'pending',
                grade: submission?.grade,
            });
        }

        // 날짜순 정렬
        timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return timeline.slice(0, 50);
    }

    // ===== TEST TREND =====

    async getChildTestTrend(hubId: string, childId: string, classId?: string) {
        const user = await this.resolveParent(hubId);
        await this.verifyParentChild(user.id, childId);

        const where: any = { studentId: childId };
        if (classId) {
            where.test = { lesson: { classId } };
        }

        const results = await this.prisma.tbTestResult.findMany({
            where,
            include: {
                test: {
                    select: {
                        title: true,
                        maxScore: true,
                        testDate: true,
                        lesson: { select: { class: { select: { name: true } } } },
                    },
                },
            },
            orderBy: { takenAt: 'asc' },
            take: 20,
        });

        return results.map((r) => ({
            testTitle: r.test.title,
            className: r.test.lesson.class.name,
            score: r.score,
            maxScore: r.test.maxScore,
            percentage: Math.round((r.score / r.test.maxScore) * 100),
            date: r.test.testDate || r.takenAt,
        }));
    }

    // ===== PRIVATE COMMENTS =====

    async createPrivateComment(hubId: string, data: {
        targetId: string; studentId?: string; contextType?: string;
        contextId?: string; content: string; imageUrl?: string;
    }) {
        const user = await this.resolveParent(hubId);

        return this.prisma.tbPrivateComment.create({
            data: {
                authorId: user.id,
                targetId: data.targetId,
                studentId: data.studentId,
                contextType: data.contextType,
                contextId: data.contextId,
                content: data.content,
                imageUrl: data.imageUrl,
            },
            include: {
                author: { select: { id: true, username: true, role: true } },
                target: { select: { id: true, username: true, role: true } },
            },
        });
    }

    async getPrivateComments(hubId: string, studentId: string) {
        const user = await this.resolveParent(hubId);

        return this.prisma.tbPrivateComment.findMany({
            where: {
                studentId,
                OR: [{ authorId: user.id }, { targetId: user.id }],
            },
            include: {
                author: { select: { id: true, username: true, role: true, avatarUrl: true } },
                target: { select: { id: true, username: true, role: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    // ===== CLASS RECORDS (공유 수업 기록) =====

    async getChildClassRecords(hubId: string, childId: string, classId?: string) {
        const user = await this.resolveParent(hubId);
        await this.verifyParentChild(user.id, childId);

        const enrollments = await this.prisma.tbClassEnrollment.findMany({
            where: { studentId: childId, parentId: user.id },
            include: {
                class: {
                    select: { id: true, name: true, subject: true },
                },
            },
        });

        const classIds = classId ? [classId] : enrollments.map((e) => e.classId);
        const classes = classId
            ? enrollments.filter((e) => e.classId === classId).map((e) => e.class)
            : enrollments.map((e) => e.class);

        // 각 수업별 기록을 조합
        const records: any[] = [];

        for (const cls of classes) {
            // 수업 기록 (LessonRecord)
            const lessonRecords = await this.prisma.tbLessonRecord.findMany({
                where: { lessonPlan: { classId: cls.id } },
                include: {
                    lessonPlan: {
                        include: {
                            assignments: {
                                include: {
                                    submissions: {
                                        where: { studentId: childId },
                                        select: { status: true, grade: true, submittedAt: true },
                                    },
                                },
                            },
                            tests: {
                                include: {
                                    results: {
                                        where: { studentId: childId },
                                        select: { score: true, feedback: true, takenAt: true },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: { recordDate: 'desc' },
            });

            // 출결 기록
            const attendances = await this.prisma.tbAttendance.findMany({
                where: { classId: cls.id, studentId: childId },
                orderBy: { date: 'desc' },
            });

            const attendanceMap = new Map(
                attendances.map((a) => [a.date.toISOString().split('T')[0], a.status]),
            );

            const classRecords = lessonRecords.map((record) => {
                const dateKey = record.recordDate.toISOString().split('T')[0];
                const assignments = record.lessonPlan.assignments.map((a) => ({
                    title: a.title,
                    status: a.submissions[0]?.status || 'pending',
                    grade: a.submissions[0]?.grade,
                }));
                const tests = record.lessonPlan.tests.map((t) => ({
                    title: t.title,
                    score: t.results[0]?.score,
                    maxScore: t.maxScore,
                    feedback: t.results[0]?.feedback,
                }));

                return {
                    date: record.recordDate,
                    lessonTitle: record.lessonPlan.title,
                    summary: record.summary,
                    pages: record.pagesFrom && record.pagesTo
                        ? `${record.pagesFrom}-${record.pagesTo}`
                        : null,
                    attendance: attendanceMap.get(dateKey) || null,
                    assignments,
                    tests,
                };
            });

            records.push({
                classId: cls.id,
                className: cls.name,
                subject: cls.subject,
                records: classRecords,
            });
        }

        return records;
    }

    // ===== HELPERS =====

    private async verifyParentChild(parentId: string, childId: string) {
        const enrollment = await this.prisma.tbClassEnrollment.findFirst({
            where: { parentId, studentId: childId },
        });

        if (!enrollment) throw new ForbiddenException('Not your child');
    }
}
