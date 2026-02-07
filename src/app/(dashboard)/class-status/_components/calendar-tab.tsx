"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    BookOpen,
    FileText,
    ClipboardCheck,
} from "lucide-react";
import type { CalendarEvent } from "@/types";

// Mock 캘린더 데이터
const mockEvents: CalendarEvent[] = [
    { date: "2025-03-03", type: "lesson", title: "이차방정식의 근과 판별식", status: "completed" },
    { date: "2025-03-07", type: "test", title: "1단원 확인 테스트", status: "completed" },
    { date: "2025-03-10", type: "lesson", title: "연립방정식의 풀이", status: "completed" },
    { date: "2025-03-14", type: "assignment_due", title: "이차방정식 연습문제 마감", status: "completed" },
    { date: "2025-03-14", type: "test", title: "2단원 확인 테스트", status: "completed" },
    { date: "2025-03-17", type: "lesson", title: "일차부등식과 연립부등식", status: "in_progress" },
    { date: "2025-03-20", type: "assignment_due", title: "연립방정식 워크시트 마감" },
    { date: "2025-03-21", type: "test", title: "중간 모의고사" },
    { date: "2025-03-24", type: "lesson", title: "삼각함수의 정의와 그래프" },
    { date: "2025-03-25", type: "assignment_due", title: "부등식 응용문제 마감" },
    { date: "2025-03-28", type: "test", title: "3단원 확인 테스트" },
    { date: "2025-03-31", type: "lesson", title: "삼각함수의 활용" },
    { date: "2025-04-01", type: "assignment_due", title: "삼각함수 개념 정리 마감" },
];

const eventTypeConfig = {
    lesson: {
        icon: BookOpen,
        color: "bg-primary/10 text-primary border-primary/30",
        label: "수업",
    },
    assignment_due: {
        icon: FileText,
        color: "bg-warning/10 text-warning border-warning/30",
        label: "과제 마감",
    },
    test: {
        icon: ClipboardCheck,
        color: "bg-success/10 text-success border-success/30",
        label: "테스트",
    },
};

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

export function CalendarTab({ studentId }: { studentId: number }) {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 2, 1)); // 2025-03
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthStr = `${year}-${String(month + 1).padStart(2, "0")}`;
    const monthEvents = mockEvents.filter((e) => e.date.startsWith(monthStr));

    const prevMonth = () =>
        setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () =>
        setCurrentDate(new Date(year, month + 1, 1));

    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    // 날짜별 이벤트 맵
    const eventsByDate: Record<string, CalendarEvent[]> = {};
    monthEvents.forEach((event) => {
        const day = event.date;
        if (!eventsByDate[day]) eventsByDate[day] = [];
        eventsByDate[day].push(event);
    });

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const selectedEvents = selectedDate ? eventsByDate[selectedDate] || [] : [];

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={prevMonth}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                            {year}년 {month + 1}월
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={nextMonth}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* 요일 헤더 */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day, i) => (
                            <div
                                key={day}
                                className={`text-center text-xs font-medium py-1 ${i === 0 ? "text-destructive" : i === 6 ? "text-primary" : "text-muted-foreground"
                                    }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* 날짜 그리드 */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* 빈 셀 */}
                        {Array.from({ length: firstDay }, (_, i) => (
                            <div key={`empty-${i}`} className="h-14" />
                        ))}

                        {/* 날짜 셀 */}
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const dayEvents = eventsByDate[dateStr] || [];
                            const isSelected = selectedDate === dateStr;
                            const dayOfWeek = (firstDay + i) % 7;

                            return (
                                <button
                                    key={day}
                                    onClick={() =>
                                        setSelectedDate(isSelected ? null : dateStr)
                                    }
                                    className={`h-14 rounded-lg p-1 text-sm transition-colors relative ${isSelected
                                            ? "bg-primary text-primary-foreground"
                                            : dayEvents.length > 0
                                                ? "hover:bg-accent cursor-pointer"
                                                : "hover:bg-muted/50"
                                        } ${dayOfWeek === 0 ? "text-destructive" : ""} ${dayOfWeek === 6 && !isSelected ? "text-primary" : ""
                                        }`}
                                >
                                    <span className="text-xs">{day}</span>
                                    {dayEvents.length > 0 && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                            {dayEvents.map((event, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`w-1.5 h-1.5 rounded-full ${event.type === "lesson"
                                                            ? "bg-primary"
                                                            : event.type === "assignment_due"
                                                                ? "bg-warning"
                                                                : "bg-success"
                                                        } ${isSelected ? "bg-primary-foreground" : ""}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* 범례 */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            수업
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-warning" />
                            과제 마감
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            테스트
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 선택된 날짜의 이벤트 */}
            {selectedDate && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            📅 {selectedDate} 일정
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                이 날짜에 일정이 없습니다.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {selectedEvents.map((event, idx) => {
                                    const config = eventTypeConfig[event.type];
                                    const Icon = config.icon;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex items-center gap-3 p-3 rounded-lg border ${config.color}`}
                                        >
                                            <Icon className="h-4 w-4 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {event.title}
                                                </p>
                                            </div>
                                            <Badge variant="secondary" className="text-xs">
                                                {config.label}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
