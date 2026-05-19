"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    UtensilsCrossed,
    Clock,
    Calendar,
    Link2,
} from "lucide-react";
import Link from "next/link";
import type { ChildSummary } from "@/types";
import { getDashboard, getCalendarEvents } from "@/lib/api/parent";
import type { CalendarEventRaw, CalendarChildRaw } from "@/lib/api/parent";
import { getSchoolMenu, getSchoolTimetable, getSchoolSchedule } from "@/lib/api/school";
import type { SchoolMenuMeal, TimetableEntry, ScheduleEvent } from "@/lib/api/school";
import { DashboardCalendar } from "@/components/DashboardCalendar";
import type { CalendarEvent, CalendarChild } from "@/components/DashboardCalendar";
import { config } from "@/lib/config";

// ==================== 유틸 ====================

function todayYM(): string {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function neisDateToISO(raw: string): string {
    // "20241106" → "2024-11-06"
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

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
            <div className="p-3">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2">
                    {icon}
                    {title}
                </p>
                {loading ? (
                    <div className="flex justify-center py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    children
                )}
            </div>
        </Card>
    );
}

function MenuWidget({ studentId }: { studentId: string }) {
    const [meals, setMeals] = useState<SchoolMenuMeal[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getSchoolMenu(studentId).then((d) => { setMeals(d); setLoading(false); });
    }, [studentId]);
    const lunch = meals.find((m) => m.mealType === "중식") || meals[0];
    return (
        <WidgetCard icon={<UtensilsCrossed className="h-3 w-3" />} title="오늘의 급식" loading={loading}>
            {lunch ? (
                <div>
                    <ul className="space-y-0.5">
                        {lunch.menu.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-xs text-foreground">{item}</li>
                        ))}
                        {lunch.menu.length > 5 && <li className="text-xs text-muted-foreground">+{lunch.menu.length - 5}개</li>}
                    </ul>
                    {lunch.kcal && <p className="text-[10px] text-muted-foreground mt-1">{lunch.kcal}</p>}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">급식 정보 없음</p>
            )}
        </WidgetCard>
    );
}

function TimetableWidget({ studentId }: { studentId: string }) {
    const [entries, setEntries] = useState<TimetableEntry[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getSchoolTimetable(studentId).then((d) => { setEntries(d); setLoading(false); });
    }, [studentId]);
    return (
        <WidgetCard icon={<Clock className="h-3 w-3" />} title="오늘의 시간표" loading={loading}>
            {entries.length > 0 ? (
                <div className="space-y-0.5">
                    {entries.slice(0, 7).map((e) => (
                        <div key={e.period} className="flex items-center gap-1.5 text-xs">
                            <span className="w-3 text-center font-medium text-muted-foreground shrink-0">{e.period}</span>
                            <span>{e.subject}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-muted-foreground">시간표 정보 없음</p>
            )}
        </WidgetCard>
    );
}

// ==================== 자녀 튜터 카드 ====================

function TutorCard({ child }: { child: ChildSummary }) {
    return (
        <Card className="group hover:shadow-md transition-all hover:border-primary/30">
            <div className="p-3 space-y-2.5">
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <BookOpen className="h-3 w-3" /> 수업 진도
                        </span>
                        <span className="font-medium">{child.progressRate}%</span>
                    </div>
                    <ProgressBar value={child.progressRate} />
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                        <FileText className="h-3 w-3" /> 미제출 과제
                    </span>
                    <span className={`font-medium ${child.pendingAssignments > 0 ? "text-warning" : "text-success"}`}>
                        {child.pendingAssignments}건
                    </span>
                </div>
                {child.latestScore !== undefined && (
                    <div className="flex justify-between items-center text-xs">
                        <span className="flex items-center gap-1 text-muted-foreground">
                            <ClipboardCheck className="h-3 w-3" /> 최근 점수
                        </span>
                        <span className="font-bold text-primary">{child.latestScore}점</span>
                    </div>
                )}
                <Link href={`/tutor/class-records?childId=${child.studentId}`}>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs mt-1 group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                        수업 기록 <ArrowRight className="h-3 w-3" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
}

// ==================== 자녀 섹션 ====================

function ChildSection({ child }: { child: ChildSummary }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                    <User className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold leading-none">{child.studentName}</h3>
                    {child.className && <p className="text-xs text-muted-foreground mt-0.5">{child.className}</p>}
                </div>
                {child.pendingAssignments > 0 && (
                    <Badge variant="warning" className="ml-auto text-xs">미제출 {child.pendingAssignments}</Badge>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <TutorCard child={child} />
                <MenuWidget studentId={child.studentId} />
                <TimetableWidget studentId={child.studentId} />
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
            <p className="text-muted-foreground mb-8 max-w-xs leading-relaxed text-sm">
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
    const [dashLoading, setDashLoading] = useState(true);

    // Calendar state
    const [calYearMonth, setCalYearMonth] = useState(todayYM);
    const [tutorEvents, setTutorEvents] = useState<CalendarEventRaw[]>([]);
    const [calChildren, setCalChildren] = useState<CalendarChildRaw[]>([]);
    const [schoolEventMap, setSchoolEventMap] = useState<Map<string, ScheduleEvent[]>>(new Map());
    const [calLoading, setCalLoading] = useState(false);

    // Load dashboard children
    useEffect(() => {
        getDashboard()
            .then((data) => {
                setChildren(
                    (data.children || []).map((c: any) => ({
                        studentId: c.student?.id || c.studentId || c.id,
                        studentName: c.student?.username || c.studentName || c.name,
                        progressRate: c.progressRate ?? 0,
                        pendingAssignments: c.pendingAssignments ?? 0,
                        latestScore: c.latestScore ?? undefined,
                        latestScoreSubject: c.latestScoreSubject || undefined,
                        className: c.classes?.[0]?.name || c.className || "",
                    }))
                );
            })
            .catch(() => setChildren([]))
            .finally(() => setDashLoading(false));
    }, []);

    // Load calendar events (tutorboard + school schedules)
    const loadCalendar = useCallback((ym: string) => {
        setCalLoading(true);
        getCalendarEvents(ym)
            .then(({ events, children: calKids }) => {
                setTutorEvents(events);
                setCalChildren(calKids);

                // Fetch school schedules per child in parallel
                Promise.all(
                    calKids.map((kid) =>
                        getSchoolSchedule(kid.id, ym).then((evts) => ({ id: kid.id, evts }))
                    )
                ).then((results) => {
                    const map = new Map<string, ScheduleEvent[]>();
                    for (const r of results) map.set(r.id, r.evts);
                    setSchoolEventMap(map);
                });
            })
            .catch(() => {})
            .finally(() => setCalLoading(false));
    }, []);

    useEffect(() => {
        loadCalendar(calYearMonth);
    }, [calYearMonth, loadCalendar]);

    // Merge tutorboard + school events for calendar
    const allCalendarEvents = useMemo<CalendarEvent[]>(() => {
        const merged: CalendarEvent[] = tutorEvents.map((e) => ({ ...e } as CalendarEvent));

        calChildren.forEach((child, colorIndex) => {
            const schedules = schoolEventMap.get(child.id) || [];
            for (const se of schedules) {
                merged.push({
                    id: `school_${child.id}_${se.date}`,
                    date: neisDateToISO(se.date),
                    title: se.name,
                    subtitle: child.schoolName ?? undefined,
                    type: "school",
                    childId: child.id,
                    childName: child.name,
                    isHoliday: se.isHoliday,
                });
            }
        });

        return merged;
    }, [tutorEvents, schoolEventMap, calChildren]);

    // Build CalendarChild array with colorIndex
    const calendarChildren = useMemo<CalendarChild[]>(
        () => calChildren.map((c, i) => ({ ...c, colorIndex: i })),
        [calChildren]
    );

    // Summary stats
    const totalPending = children.reduce((s, c) => s + c.pendingAssignments, 0);
    const avgProgress =
        children.length > 0
            ? Math.round(children.reduce((s, c) => s + c.progressRate, 0) / children.length)
            : 0;

    if (dashLoading) {
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
        <div className="p-6 space-y-6">
            {/* 인사 헤더 */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">👋 안녕하세요</h1>
                <p className="text-muted-foreground text-sm mt-0.5">
                    자녀의 수업 현황과 학교 정보를 확인하세요
                </p>
            </div>

            {/* 요약 통계 */}
            <div className="grid grid-cols-3 gap-3">
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <User className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">등록 자녀</p>
                            <p className="text-xl font-bold">{children.length}명</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10 text-warning">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">미제출 과제</p>
                            <p className="text-xl font-bold">{totalPending}건</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success">
                            <ClipboardCheck className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">평균 진도율</p>
                            <p className="text-xl font-bold">{avgProgress}%</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 통합 일정 캘린더 */}
            <div>
                <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    수업 &amp; 학교 일정
                </h2>
                <DashboardCalendar
                    events={allCalendarEvents}
                    children={calendarChildren}
                    loading={calLoading}
                    onNavigate={(ym) => setCalYearMonth(ym)}
                />
            </div>

            {/* 자녀별 오늘의 현황 */}
            <div className="space-y-6">
                <h2 className="text-base font-semibold">오늘의 자녀 현황</h2>
                {children.map((child) => (
                    <ChildSection key={child.studentId} child={child} />
                ))}
            </div>
        </div>
    );
}
