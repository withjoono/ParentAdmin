"use client";

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
} from "lucide-react";
import Link from "next/link";
import type { ChildSummary } from "@/types";

// ==================== Mock 데이터 ====================

const mockParentName = "김학부모";

const mockChildrenSummary: ChildSummary[] = [
    {
        studentId: 1,
        studentName: "김민수",
        progressRate: 75,
        pendingAssignments: 1,
        latestScore: 85,
        latestScoreSubject: "수학",
        className: "A반 수학",
    },
    {
        studentId: 2,
        studentName: "김영희",
        progressRate: 60,
        pendingAssignments: 0,
        latestScore: 92,
        latestScoreSubject: "영어",
        className: "B반 영어",
    },
];

// ==================== 컴포넌트 ====================

function ChildSummaryCard({ child }: { child: ChildSummary }) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">{child.studentName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{child.className}</p>
                        </div>
                    </div>
                    {child.pendingAssignments > 0 && (
                        <Badge variant="warning">미제출 {child.pendingAssignments}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 진도율 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <BookOpen className="h-3.5 w-3.5" />
                            수업 진도
                        </span>
                        <span className="font-medium">{child.progressRate}%</span>
                    </div>
                    <ProgressBar value={child.progressRate} />
                </div>

                {/* 미제출 과제 */}
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" />
                        미제출 과제
                    </span>
                    <span
                        className={`font-medium ${child.pendingAssignments > 0
                                ? "text-warning"
                                : "text-success"
                            }`}
                    >
                        {child.pendingAssignments}건
                    </span>
                </div>

                {/* 최근 점수 */}
                {child.latestScore !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <ClipboardCheck className="h-3.5 w-3.5" />
                            최근 점수 ({child.latestScoreSubject})
                        </span>
                        <span className="font-bold text-primary">{child.latestScore}점</span>
                    </div>
                )}

                {/* 상세보기 버튼 */}
                <Link href={`/class-status?studentId=${child.studentId}`}>
                    <Button
                        variant="outline"
                        className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                        상세보기
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    return (
        <div className="p-6 space-y-6">
            {/* 인사 헤더 */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                    👋 안녕하세요, {mockParentName}님
                </h1>
                <p className="text-muted-foreground">
                    자녀의 수업 현황을 한눈에 확인하세요
                </p>
            </div>

            {/* 요약 통계 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">등록 자녀</p>
                            <p className="text-2xl font-bold">{mockChildrenSummary.length}명</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">미제출 과제</p>
                            <p className="text-2xl font-bold">
                                {mockChildrenSummary.reduce(
                                    (sum, c) => sum + c.pendingAssignments,
                                    0
                                )}
                                건
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
                            <ClipboardCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">평균 진도율</p>
                            <p className="text-2xl font-bold">
                                {Math.round(
                                    mockChildrenSummary.reduce(
                                        (sum, c) => sum + c.progressRate,
                                        0
                                    ) / mockChildrenSummary.length
                                )}
                                %
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 자녀별 카드 */}
            <div>
                <h2 className="text-lg font-semibold mb-4">자녀별 현황</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockChildrenSummary.map((child) => (
                        <ChildSummaryCard key={child.studentId} child={child} />
                    ))}
                </div>
            </div>
        </div>
    );
}
