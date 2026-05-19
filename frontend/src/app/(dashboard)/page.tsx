"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    FileText,
    ClipboardCheck,
    ArrowRight,
    User,
    Loader2,
    Calendar,
    Clock,
    UtensilsCrossed,
    Link2,
} from "lucide-react";
import Link from "next/link";
import type { ChildSummary } from "@/types";
import { getDashboard } from "@/lib/api/parent";
import { getSchoolMenu, getSchoolTimetable, getSchoolSchedule } from "@/lib/api/school";
import type { SchoolMenuMeal, TimetableEntry, ScheduleEvent } from "@/lib/api/school";
import { config } from "@/lib/config";

// ==================== 학교 위젯 ====================

function WidgetCard({
    icon,
    title,
    children,
    loading,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    loading?: boolean;
}) {
    return (
        <Card className="flex-1 min-w-0">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}

function MenuWidget({ studentId }: { studentId: string }) {
    const [meals, setMeals] = useState<SchoolMenuMeal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSchoolMenu(studentId).then((data) => {
            setMeals(data);
            setLoading(false);
        });
    }, [studentId]);

    const lunch = meals.find((m) => m.mealType === "중식") || meals[0];

    return (
        <WidgetCard icon={<UtensilsCrossed className="h-3.5 w-3.5" />} title="오늘의 급식" loading={loading}>
            {lunch ? (
                <div className="space-y-1">
                    <ul className="space-y-0.5">
                        {lunch.menu.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-xs text-foreground leading-relaxed">
                                {item}
                            </li>
                        ))}
                        {lunch.menu.length > 5 && (
                            <li className="text-xs text-muted-foreground">+{lunch.menu.length - 5}개</li>
                        )}
                    </ul>
                    {lunch.kcal && (
                        <p className="text-xs text-muted-foreground pt-1">{lunch.kcal}</p>
                    )}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground py-2">오늘의 급식 정보가 없습니다</p>
            )}
        </WidgetCard>
    );
}

function TimetableWidget({ studentId }: { studentId: string }) {
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSchoolTimetable(studentId).then((data) => {
            setEntries(data);
            setLoading(false);
        });
    }, [studentId]);

    return (
        <WidgetCard icon={<Clock className="h-3.5 w-3.5" />} title="오늘의 시간표" loading={loading}>
            {entries.length > 0 ? (
                <div className="space-y-0.5">
                    {entries.slice(0, 7).map((entry) => (
                        <div key={entry.period} className="flex items-center gap-2 text-xs">
                            <span className="w-4 text-center font-medium text-muted-foreground shrink-0">
                                {entry.period}
                            </span>
                            <span className="text-foreground">{entry.subject}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground py-2">오늘의 시간표 정보가 없습니다</p>
            )}
        </WidgetCard>
    );
}

function ScheduleWidget({ studentId }: { studentId: string }) {
    const [events, setEvents] = useState<ScheduleEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSchoolSchedule(studentId).then((data) => {
            setEvents(data);
            setLoading(false);
        });
    }, [studentId]);

    const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, '');
    const upcoming = events.filter((e) => e.date >= today).slice(0, 5);

    return (
        <WidgetCard icon={<Calendar className="h-3.5 w-3.5" />} title="학교 일정" loading={loading}>
            {upcoming.length > 0 ? (
                <div className="space-y-1">
                    {upcoming.map((ev, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                            <span className="text-muted-foreground shrink-0 tabular-nums">
                                {ev.date.slice(4, 6)}/{ev.date.slice(6, 8)}
                            </span>
                            <span className={ev.isHoliday ? "text-destructive font-medium" : "text-foreground"}>
                                {ev.name}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground py-2">이번 달 학교 일정이 없습니다</p>
            )}
        </WidgetCard>
    );
}

// ==================== 자녀 튜터 카드 ====================

function TutorCard({ child }: { child: ChildSummary }) {
    return (
        <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/30">
            <CardContent className="p-4 space-y-3">
                {/* 진도율 */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            수업 진도
                        </span>
                        <span className="font-medium">{child.progressRate}%</span>
                    </div>
                    <ProgressBar value={child.progressRate} />
                </div>

                {/* 미제출 과제 */}
                <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        미제출 과제
                    </span>
                    <span className={`font-medium ${child.pendingAssignments > 0 ? "text-warning" : "text-success"}`}>
                        {child.pendingAssignments}건
                    </span>
                </div>

                {/* 최근 점수 */}
                {child.latestScore !== undefined && (
                    <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <ClipboardCheck className="h-3 w-3" />
                            최근 점수
                            {child.latestScoreSubject && (
                                <span className="text-muted-foreground/60">({child.latestScoreSubject})</span>
                            )}
                        </span>
                        <span className="font-bold text-primary">{child.latestScore}점</span>
                    </div>
                )}

                <Link href={`/tutor/class-records?childId=${child.studentId}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-1 text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                        수업 기록 보기
                        <ArrowRight className="h-3 w-3" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

// ==================== 자녀 섹션 ====================

function ChildSection({ child, index }: { child: ChildSummary; index: number }) {
    return (
        <div className="space-y-3">
            {/* 자녀 섹션 헤더 */}
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <User className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="text-base font-semibold leading-none">{child.studentName}</h2>
                    {child.className && (
                        <p className="text-xs text-muted-foreground mt-0.5">{child.className}</p>
                    )}
                </div>
                {child.pendingAssignments > 0 && (
                    <Badge variant="warning" className="ml-auto">
                        미제출 {child.pendingAssignments}
                    </Badge>
                )}
            </div>

            {/* 카드 그리드: 튜터 + 학교 위젯 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <TutorCard child={child} />
                <MenuWidget studentId={child.studentId} />
                <TimetableWidget studentId={child.studentId} />
                <ScheduleWidget studentId={child.studentId} />
            </div>
        </div>
    );
}

// ==================== 빈 상태 ====================

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
            <div className="text-7xl mb-6 select-none">👨‍👩‍👧‍👦</div>
            <h2 className="text-2xl font-bold mb-2">자녀와 계정 연동하세요</h2>
            <p className="text-muted-foreground mb-8 max-w-xs leading-relaxed">
                자녀와 계정을 연동하면 수업 현황, 급식, 시간표, 학교 일정을 한눈에 확인할 수 있어요
            </p>
            <a href={`${config.hubUrl}/account-linkage`}>
                <Button size="lg" className="gap-2">
                    <Link2 className="h-4 w-4" />
                    지금 연동하기
                </Button>
            </a>
        </div>
    );
}

// ==================== 대시보드 페이지 ====================

export default function DashboardPage() {
    const [children, setChildren] = useState<ChildSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard()
            .then((data) => {
                const mapped: ChildSummary[] = (data.children || []).map((c: any) => ({
                    studentId: c.student?.id || c.studentId || c.id,
                    studentName: c.student?.username || c.studentName || c.name,
                    progressRate: c.progressRate ?? 0,
                    pendingAssignments: c.pendingAssignments ?? 0,
                    latestScore: c.latestScore ?? undefined,
                    latestScoreSubject: c.latestScoreSubject || undefined,
                    className: c.classes?.[0]?.name || c.className || '',
                }));
                setChildren(mapped);
            })
            .catch(() => setChildren([]))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (children.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="p-6 space-y-8">
            {/* 인사 헤더 */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">👋 안녕하세요</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    자녀의 수업 현황과 학교 정보를 확인하세요
                </p>
            </div>

            {/* 요약 통계 */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <User className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">등록 자녀</p>
                            <p className="text-xl font-bold">{children.length}명</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/20 text-warning">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">미제출 과제</p>
                            <p className="text-xl font-bold">
                                {children.reduce((s, c) => s + c.pendingAssignments, 0)}건
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/20 text-success">
                            <ClipboardCheck className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">평균 진도율</p>
                            <p className="text-xl font-bold">
                                {Math.round(children.reduce((s, c) => s + c.progressRate, 0) / children.length)}%
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 자녀별 섹션 */}
            <div className="space-y-8">
                {children.map((child, i) => (
                    <ChildSection key={child.studentId} child={child} index={i} />
                ))}
            </div>
        </div>
    );
}
