"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { BookOpen, Clock, CheckCircle, Circle } from "lucide-react";
import type { LessonPlan } from "@/types";

// Mock 수업 진도 데이터
const mockLessonPlans: LessonPlan[] = [
    {
        id: 1,
        classId: "class-1",
        week: 1,
        title: "이차방정식의 근과 판별식",
        subject: "수학",
        scheduledDate: "2025-03-03",
        progress: 100,
        status: "completed",
        updatedAt: "2025-03-03",
    },
    {
        id: 2,
        classId: "class-1",
        week: 2,
        title: "연립방정식의 풀이",
        subject: "수학",
        scheduledDate: "2025-03-10",
        progress: 100,
        status: "completed",
        updatedAt: "2025-03-10",
    },
    {
        id: 3,
        classId: "class-1",
        week: 3,
        title: "일차부등식과 연립부등식",
        subject: "수학",
        scheduledDate: "2025-03-17",
        progress: 60,
        status: "in_progress",
        updatedAt: "2025-03-18",
    },
    {
        id: 4,
        classId: "class-1",
        week: 4,
        title: "삼각함수의 정의와 그래프",
        subject: "수학",
        scheduledDate: "2025-03-24",
        progress: 0,
        status: "scheduled",
        updatedAt: "2025-03-24",
    },
    {
        id: 5,
        classId: "class-1",
        week: 5,
        title: "삼각함수의 활용",
        subject: "수학",
        scheduledDate: "2025-03-31",
        progress: 0,
        status: "scheduled",
        updatedAt: "2025-03-31",
    },
];

function getStatusBadge(status: LessonPlan["status"]) {
    switch (status) {
        case "completed":
            return (
                <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    완료
                </Badge>
            );
        case "in_progress":
            return (
                <Badge variant="default" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    진행중
                </Badge>
            );
        case "scheduled":
            return (
                <Badge variant="secondary" className="flex items-center gap-1">
                    <Circle className="h-3 w-3" />
                    예정
                </Badge>
            );
    }
}

export function LessonProgressTab({ studentId }: { studentId: number }) {
    // TODO: React Query로 API 연동 시 studentId 사용
    const lessons = mockLessonPlans;
    const completedCount = lessons.filter((l) => l.status === "completed").length;
    const overallProgress = Math.round(
        lessons.reduce((sum, l) => sum + l.progress, 0) / lessons.length
    );

    return (
        <div className="space-y-4">
            {/* 전체 진도 요약 */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            <span className="font-medium">전체 진도율</span>
                        </div>
                        <span className="text-lg font-bold text-primary">
                            {overallProgress}%
                        </span>
                    </div>
                    <ProgressBar value={overallProgress} />
                    <p className="text-xs text-muted-foreground mt-2">
                        총 {lessons.length}개 수업 중 {completedCount}개 완료
                    </p>
                </CardContent>
            </Card>

            {/* 주차별 수업 목록 */}
            <div className="space-y-3">
                {lessons.map((lesson) => (
                    <Card
                        key={lesson.id}
                        className="hover:shadow-md transition-shadow duration-200"
                    >
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                            {lesson.week}주차
                                        </span>
                                        {getStatusBadge(lesson.status)}
                                    </div>
                                    <h3 className="font-medium truncate">{lesson.title}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        📅 {lesson.scheduledDate}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <span className="text-sm font-bold">{lesson.progress}%</span>
                                    <div className="w-20">
                                        <ProgressBar value={lesson.progress} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
