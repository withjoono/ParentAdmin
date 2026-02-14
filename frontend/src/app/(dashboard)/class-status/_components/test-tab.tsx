"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import {
    ClipboardCheck,
    CheckCircle,
    MinusCircle,
    MessageSquare,
    TrendingUp,
} from "lucide-react";
import type { Test } from "@/types";

// Mock 테스트 데이터
const mockTests: Test[] = [
    {
        id: 1,
        title: "1단원 확인 테스트",
        description: "이차방정식 단원 확인",
        testDate: "2025-03-07",
        maxScore: 100,
        subject: "수학",
        result: {
            id: 1,
            score: 85,
            feedback: "이차방정식 개념을 잘 이해하고 있습니다. 응용 문제 연습을 조금 더 해보세요.",
            takenAt: "2025-03-07",
        },
    },
    {
        id: 2,
        title: "2단원 확인 테스트",
        description: "연립방정식 단원 확인",
        testDate: "2025-03-14",
        maxScore: 100,
        subject: "수학",
        result: {
            id: 2,
            score: 92,
            feedback: "매우 우수합니다!",
            takenAt: "2025-03-14",
        },
    },
    {
        id: 3,
        title: "중간 모의고사",
        description: "1~3단원 범위",
        testDate: "2025-03-21",
        maxScore: 100,
        subject: "수학",
        result: {
            id: 3,
            score: 78,
            feedback: "부등식 파트에서 오답이 많았습니다. 복습이 필요합니다.",
            takenAt: "2025-03-21",
        },
    },
    {
        id: 4,
        title: "3단원 확인 테스트",
        description: "부등식 단원 확인",
        testDate: "2025-03-28",
        maxScore: 100,
        subject: "수학",
        result: undefined,
    },
];

function getScoreColor(score: number, maxScore: number) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return "text-success";
    if (percentage >= 70) return "text-primary";
    if (percentage >= 50) return "text-warning";
    return "text-destructive";
}

export function TestTab({ studentId }: { studentId: number }) {
    const tests = mockTests;
    const completedTests = tests.filter((t) => t.result);
    const avgScore =
        completedTests.length > 0
            ? Math.round(
                completedTests.reduce((sum, t) => sum + (t.result?.score || 0), 0) /
                completedTests.length
            )
            : 0;

    return (
        <div className="space-y-4">
            {/* 요약 */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ClipboardCheck className="h-5 w-5 text-primary" />
                            <span className="font-medium">테스트 현황</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">응시: </span>
                                <span className="font-bold">{completedTests.length}</span>
                                <span className="text-muted-foreground">/{tests.length}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <span className="text-muted-foreground">평균: </span>
                                <span className="font-bold text-primary">{avgScore}점</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 테스트 목록 */}
            <div className="space-y-3">
                {tests.map((test) => (
                    <Card
                        key={test.id}
                        className="hover:shadow-md transition-shadow duration-200"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium">{test.title}</h3>
                                        {test.result ? (
                                            <Badge variant="success" className="flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                응시 완료
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                <MinusCircle className="h-3 w-3" />
                                                미응시
                                            </Badge>
                                        )}
                                    </div>

                                    {test.description && (
                                        <p className="text-sm text-muted-foreground">
                                            {test.description}
                                        </p>
                                    )}

                                    <p className="text-xs text-muted-foreground">
                                        📅 시험일: {test.testDate}
                                    </p>

                                    {/* 점수 바 */}
                                    {test.result && (
                                        <div className="space-y-1">
                                            <ProgressBar
                                                value={test.result.score}
                                                max={test.maxScore}
                                            />
                                        </div>
                                    )}

                                    {/* 피드백 */}
                                    {test.result?.feedback && (
                                        <div className="mt-2 p-3 rounded-lg bg-muted/50 border border-muted">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                                                <MessageSquare className="h-3 w-3" />
                                                선생님 피드백
                                            </div>
                                            <p className="text-sm">{test.result.feedback}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 점수 */}
                                {test.result ? (
                                    <div className="flex flex-col items-center flex-shrink-0">
                                        <span
                                            className={`text-3xl font-bold ${getScoreColor(
                                                test.result.score,
                                                test.maxScore
                                            )}`}
                                        >
                                            {test.result.score}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            / {test.maxScore}점
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center flex-shrink-0 text-muted-foreground">
                                        <span className="text-3xl font-bold">—</span>
                                        <span className="text-xs">미응시</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
