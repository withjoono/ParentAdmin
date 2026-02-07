"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    MessageSquare,
} from "lucide-react";
import type { Assignment } from "@/types";

// Mock 과제 데이터
const mockAssignments: Assignment[] = [
    {
        id: 1,
        title: "이차방정식 연습문제 풀이",
        description: "교재 p.45~48 문제 풀기",
        dueDate: "2025-03-14",
        subject: "수학",
        submission: {
            id: 1,
            submittedAt: "2025-03-13",
            grade: 85,
            feedback: "잘 풀었습니다. 3번 문제 풀이 과정을 더 자세히 써주세요.",
        },
    },
    {
        id: 2,
        title: "연립방정식 워크시트",
        description: "워크시트 1~20번 풀기",
        dueDate: "2025-03-20",
        subject: "수학",
        submission: {
            id: 2,
            submittedAt: "2025-03-19",
            grade: 92,
            feedback: "완벽합니다!",
        },
    },
    {
        id: 3,
        title: "부등식 응용문제",
        description: "프린트 문제 풀기",
        dueDate: "2025-03-25",
        subject: "수학",
        submission: undefined,
    },
    {
        id: 4,
        title: "삼각함수 개념 정리",
        description: "삼각함수의 정의와 그래프를 노트에 정리",
        dueDate: "2025-04-01",
        subject: "수학",
        submission: undefined,
    },
];

function getSubmissionStatus(assignment: Assignment) {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = now > dueDate;

    if (assignment.submission?.submittedAt) {
        return {
            icon: <CheckCircle className="h-4 w-4" />,
            label: "제출 완료",
            variant: "success" as const,
        };
    }
    if (isOverdue) {
        return {
            icon: <XCircle className="h-4 w-4" />,
            label: "미제출 (기한 초과)",
            variant: "destructive" as const,
        };
    }

    const daysLeft = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft <= 3) {
        return {
            icon: <AlertTriangle className="h-4 w-4" />,
            label: `D-${daysLeft}`,
            variant: "warning" as const,
        };
    }
    return {
        icon: <Clock className="h-4 w-4" />,
        label: `D-${daysLeft}`,
        variant: "secondary" as const,
    };
}

export function AssignmentTab({ studentId }: { studentId: number }) {
    const assignments = mockAssignments;
    const submittedCount = assignments.filter(
        (a) => a.submission?.submittedAt
    ).length;

    return (
        <div className="space-y-4">
            {/* 요약 */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">과제 현황</span>
                        </div>
                        <div className="text-sm">
                            <span className="font-bold text-primary">{submittedCount}</span>
                            <span className="text-muted-foreground">
                                /{assignments.length} 제출
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 과제 목록 */}
            <div className="space-y-3">
                {assignments.map((assignment) => {
                    const status = getSubmissionStatus(assignment);
                    return (
                        <Card
                            key={assignment.id}
                            className="hover:shadow-md transition-shadow duration-200"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium">{assignment.title}</h3>
                                            <Badge
                                                variant={status.variant}
                                                className="flex items-center gap-1"
                                            >
                                                {status.icon}
                                                {status.label}
                                            </Badge>
                                        </div>

                                        {assignment.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {assignment.description}
                                            </p>
                                        )}

                                        <p className="text-xs text-muted-foreground">
                                            📅 마감: {assignment.dueDate}
                                        </p>

                                        {/* 피드백 */}
                                        {assignment.submission?.feedback && (
                                            <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-muted">
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                                                    <MessageSquare className="h-3 w-3" />
                                                    선생님 피드백
                                                </div>
                                                <p className="text-sm">{assignment.submission.feedback}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* 점수 */}
                                    {assignment.submission?.grade !== undefined && (
                                        <div className="flex flex-col items-center flex-shrink-0">
                                            <span className="text-2xl font-bold text-primary">
                                                {assignment.submission.grade}
                                            </span>
                                            <span className="text-xs text-muted-foreground">점</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
