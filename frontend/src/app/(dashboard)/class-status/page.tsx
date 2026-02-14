"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, ClipboardCheck, Calendar } from "lucide-react";
import { LessonProgressTab } from "./_components/lesson-progress-tab";
import { AssignmentTab } from "./_components/assignment-tab";
import { TestTab } from "./_components/test-tab";
import { CalendarTab } from "./_components/calendar-tab";

// Mock 자녀 목록
const mockChildren = [
    { value: "1", label: "김민수 (A반 수학)" },
    { value: "2", label: "김영희 (B반 영어)" },
];

export default function ClassStatusPage() {
    const [selectedChild, setSelectedChild] = useState("1");

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        수업 현황
                    </h1>
                    <p className="text-muted-foreground">
                        자녀의 수업 진도, 과제, 테스트 결과를 확인하세요
                    </p>
                </div>
            </div>

            {/* 자녀 선택 */}
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-muted-foreground">
                    자녀 선택:
                </label>
                <div className="w-64">
                    <Select
                        options={mockChildren}
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                    />
                </div>
            </div>

            {/* 탭 영역 */}
            <Tabs defaultValue="lessons" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
                    <TabsTrigger value="lessons" className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        수업 진도
                    </TabsTrigger>
                    <TabsTrigger
                        value="assignments"
                        className="flex items-center gap-1.5"
                    >
                        <FileText className="h-3.5 w-3.5" />
                        과제
                    </TabsTrigger>
                    <TabsTrigger value="tests" className="flex items-center gap-1.5">
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        테스트
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        캘린더
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="lessons">
                    <LessonProgressTab studentId={Number(selectedChild)} />
                </TabsContent>

                <TabsContent value="assignments">
                    <AssignmentTab studentId={Number(selectedChild)} />
                </TabsContent>

                <TabsContent value="tests">
                    <TestTab studentId={Number(selectedChild)} />
                </TabsContent>

                <TabsContent value="calendar">
                    <CalendarTab studentId={Number(selectedChild)} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
