"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    BookOpen,
    FileText,
    ClipboardCheck,
    School,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ==================== Types ====================

export type EventType = "lesson" | "assignment" | "test" | "school";
export type ViewMode = "month" | "week" | "day";

export interface CalendarEvent {
    id: string;
    date: string; // YYYY-MM-DD
    title: string;
    subtitle?: string;
    type: EventType;
    childId: string;
    childName: string;
    isHoliday?: boolean;
    completed?: boolean;
}

export interface CalendarChild {
    id: string;
    name: string;
    schoolName: string | null;
    colorIndex: number;
}

interface Props {
    events: CalendarEvent[];
    children: CalendarChild[];
    loading?: boolean;
    onNavigate?: (yearMonth: string) => void;
}

// ==================== Constants ====================

const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

const CHILD_COLORS = [
    {
        chip: "bg-blue-50 text-blue-700 border border-blue-200",
        dot: "bg-blue-500",
        header: "text-blue-700",
    },
    {
        chip: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dot: "bg-emerald-500",
        header: "text-emerald-700",
    },
    {
        chip: "bg-amber-50 text-amber-700 border border-amber-200",
        dot: "bg-amber-500",
        header: "text-amber-700",
    },
    {
        chip: "bg-rose-50 text-rose-700 border border-rose-200",
        dot: "bg-rose-500",
        header: "text-rose-700",
    },
    {
        chip: "bg-purple-50 text-purple-700 border border-purple-200",
        dot: "bg-purple-500",
        header: "text-purple-700",
    },
];

const TYPE_META: Record<EventType, { icon: React.ElementType; label: string }> = {
    lesson: { icon: BookOpen, label: "수업" },
    assignment: { icon: FileText, label: "과제" },
    test: { icon: ClipboardCheck, label: "시험" },
    school: { icon: School, label: "학교" },
};

// ==================== Helpers ====================

function dateFmt(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
    const first = new Date(year, month - 1, 1).getDay();
    const days = new Date(year, month, 0).getDate();
    const grid: (Date | null)[] = [];
    for (let i = 0; i < first; i++) grid.push(null);
    for (let d = 1; d <= days; d++) grid.push(new Date(year, month - 1, d));
    while (grid.length % 7 !== 0) grid.push(null);
    return grid;
}

function getWeekDays(anchor: Date): Date[] {
    const start = new Date(anchor);
    start.setDate(anchor.getDate() - anchor.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
}

function yearMonth(date: Date): string {
    return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
}

// ==================== EventChip ====================

function EventChip({
    event,
    colorSet,
}: {
    event: CalendarEvent;
    colorSet: (typeof CHILD_COLORS)[number];
}) {
    const Icon = TYPE_META[event.type].icon;
    return (
        <div
            className={cn(
                "flex items-center gap-1 rounded text-[10px] leading-tight px-1 py-0.5 truncate w-full",
                colorSet.chip,
                event.isHoliday && "line-through opacity-60"
            )}
        >
            {event.completed ? (
                <CheckCircle2 className="h-2.5 w-2.5 shrink-0 opacity-60" />
            ) : (
                <Icon className="h-2.5 w-2.5 shrink-0" />
            )}
            <span className="truncate">{event.title}</span>
        </div>
    );
}

// ==================== DayEventList ====================

function DayEventList({
    events,
    childMap,
}: {
    events: CalendarEvent[];
    childMap: Map<string, CalendarChild>;
}) {
    if (events.length === 0) {
        return (
            <p className="text-sm text-muted-foreground text-center py-6">
                이 날 일정이 없습니다
            </p>
        );
    }

    const sorted = [...events].sort((a, b) => {
        const order: Record<EventType, number> = { lesson: 0, test: 1, assignment: 2, school: 3 };
        return order[a.type] - order[b.type];
    });

    return (
        <div className="space-y-2">
            {sorted.map((event) => {
                const child = childMap.get(event.childId);
                const color = child ? CHILD_COLORS[child.colorIndex % CHILD_COLORS.length] : CHILD_COLORS[0];
                const Icon = TYPE_META[event.type].icon;
                return (
                    <div
                        key={event.id}
                        className={cn(
                            "flex items-start gap-2.5 rounded-lg p-2.5 text-sm",
                            color.chip
                        )}
                    >
                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                            {event.completed ? (
                                <CheckCircle2 className="h-4 w-4 opacity-60" />
                            ) : (
                                <Icon className="h-4 w-4" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={cn("font-medium leading-tight", event.isHoliday && "text-destructive")}>
                                {event.title}
                            </p>
                            <p className="text-xs opacity-70 mt-0.5">
                                {event.childName}
                                {event.subtitle && ` · ${event.subtitle}`}
                            </p>
                        </div>
                        <span className="text-[10px] opacity-60 shrink-0 pt-0.5">
                            {TYPE_META[event.type].label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

// ==================== DashboardCalendar ====================

export function DashboardCalendar({ events, children, loading, onNavigate }: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [viewDate, setViewDate] = useState(() => new Date());
    const today = dateFmt(new Date());

    const childMap = useMemo(() => new Map(children.map((c) => [c.id, c])), [children]);

    const eventsByDate = useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        for (const e of events) {
            if (!map.has(e.date)) map.set(e.date, []);
            map.get(e.date)!.push(e);
        }
        return map;
    }, [events]);

    const navigate = useCallback(
        (dir: 1 | -1) => {
            const d = new Date(viewDate);
            if (viewMode === "month") d.setMonth(d.getMonth() + dir);
            else if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
            else d.setDate(d.getDate() + dir);
            setViewDate(d);
            onNavigate?.(yearMonth(d));
        },
        [viewDate, viewMode, onNavigate]
    );

    const goToday = useCallback(() => {
        const d = new Date();
        setViewDate(d);
        onNavigate?.(yearMonth(d));
    }, [onNavigate]);

    const switchView = (mode: ViewMode) => {
        setViewMode(mode);
        // When switching to day view, anchor on today if currently on month/week
        if (mode === "day" && viewMode !== "day") {
            setViewDate(new Date());
        }
    };

    // ── Header label ──
    const headerLabel = useMemo(() => {
        const y = viewDate.getFullYear();
        const m = viewDate.getMonth() + 1;
        if (viewMode === "month") return `${y}년 ${m}월`;
        if (viewMode === "week") {
            const week = getWeekDays(viewDate);
            const s = week[0], e = week[6];
            if (s.getMonth() === e.getMonth()) {
                return `${y}년 ${m}월 ${s.getDate()}일 – ${e.getDate()}일`;
            }
            return `${s.getFullYear()}년 ${s.getMonth() + 1}월 ${s.getDate()}일 – ${e.getMonth() + 1}월 ${e.getDate()}일`;
        }
        return `${y}년 ${m}월 ${viewDate.getDate()}일 (${DAYS_KO[viewDate.getDay()]})`;
    }, [viewDate, viewMode]);

    // ── Month view ──
    const renderMonth = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth() + 1;
        const grid = getMonthGrid(year, month);

        return (
            <div>
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b">
                    {DAYS_KO.map((d, i) => (
                        <div
                            key={d}
                            className={cn(
                                "py-1.5 text-center text-xs font-medium",
                                i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-muted-foreground"
                            )}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                    {grid.map((day, idx) => {
                        if (!day) {
                            return <div key={`pad_${idx}`} className="min-h-[90px] border-b border-r bg-muted/10 last:border-r-0" />;
                        }
                        const ds = dateFmt(day);
                        const dayEvents = eventsByDate.get(ds) || [];
                        const isToday = ds === today;
                        const dow = day.getDay();
                        const MAX = 3;
                        const visible = dayEvents.slice(0, MAX);
                        const overflow = dayEvents.length - MAX;

                        return (
                            <div
                                key={ds}
                                className={cn(
                                    "min-h-[90px] border-b border-r p-1 cursor-pointer hover:bg-accent/50 transition-colors last:border-r-0",
                                    isToday && "bg-primary/5"
                                )}
                                onClick={() => {
                                    setViewDate(day);
                                    setViewMode("day");
                                }}
                            >
                                {/* Day number */}
                                <div
                                    className={cn(
                                        "w-5 h-5 flex items-center justify-center rounded-full text-xs font-medium mb-0.5",
                                        isToday ? "bg-primary text-primary-foreground" :
                                            dow === 0 ? "text-red-500" :
                                                dow === 6 ? "text-blue-500" : "text-foreground"
                                    )}
                                >
                                    {day.getDate()}
                                </div>

                                {/* Event chips */}
                                <div className="space-y-0.5">
                                    {visible.map((event) => {
                                        const child = childMap.get(event.childId);
                                        const color = child ? CHILD_COLORS[child.colorIndex % CHILD_COLORS.length] : CHILD_COLORS[0];
                                        return <EventChip key={event.id} event={event} colorSet={color} />;
                                    })}
                                    {overflow > 0 && (
                                        <p className="text-[10px] text-muted-foreground pl-0.5">+{overflow}개 더</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // ── Week view ──
    const renderWeek = () => {
        const week = getWeekDays(viewDate);
        return (
            <div>
                {/* Column headers */}
                <div className="grid grid-cols-7 border-b">
                    {week.map((day, i) => {
                        const ds = dateFmt(day);
                        const isToday = ds === today;
                        const dow = day.getDay();
                        return (
                            <div key={ds} className="border-r last:border-r-0 p-2 text-center">
                                <p className={cn(
                                    "text-[11px] font-medium mb-1",
                                    dow === 0 ? "text-red-500" : dow === 6 ? "text-blue-500" : "text-muted-foreground"
                                )}>
                                    {DAYS_KO[dow]}
                                </p>
                                <div
                                    className={cn(
                                        "w-7 h-7 mx-auto flex items-center justify-center rounded-full text-sm cursor-pointer hover:bg-accent",
                                        isToday ? "bg-primary text-primary-foreground font-bold" :
                                            dow === 0 ? "text-red-500" :
                                                dow === 6 ? "text-blue-500" : "text-foreground"
                                    )}
                                    onClick={() => { setViewDate(day); setViewMode("day"); }}
                                >
                                    {day.getDate()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Event rows */}
                <div className="grid grid-cols-7 min-h-[180px]">
                    {week.map((day, i) => {
                        const ds = dateFmt(day);
                        const dayEvents = eventsByDate.get(ds) || [];
                        return (
                            <div key={ds} className="border-r last:border-r-0 p-1 space-y-0.5 min-h-[120px]">
                                {dayEvents.map((event) => {
                                    const child = childMap.get(event.childId);
                                    const color = child ? CHILD_COLORS[child.colorIndex % CHILD_COLORS.length] : CHILD_COLORS[0];
                                    return <EventChip key={event.id} event={event} colorSet={color} />;
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // ── Day view ──
    const renderDay = () => {
        const ds = dateFmt(viewDate);
        const dayEvents = eventsByDate.get(ds) || [];
        return (
            <div className="p-4">
                <DayEventList events={dayEvents} childMap={childMap} />
            </div>
        );
    };

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* View mode switcher */}
                    <div className="flex rounded-lg border bg-muted/30 p-0.5 self-start">
                        {(["month", "week", "day"] as ViewMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => switchView(mode)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                    viewMode === mode
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {mode === "month" ? "월간" : mode === "week" ? "주간" : "일간"}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={goToday} className="text-xs h-7 px-2">
                            오늘
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold min-w-[180px] text-center tabular-nums">
                            {headerLabel}
                        </span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate(1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Legend */}
                {children.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        {children.map((child) => {
                            const color = CHILD_COLORS[child.colorIndex % CHILD_COLORS.length];
                            return (
                                <div key={child.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <div className={cn("w-2 h-2 rounded-full shrink-0", color.dot)} />
                                    <span>{child.name}</span>
                                    {child.schoolName && (
                                        <span className="opacity-60">({child.schoolName})</span>
                                    )}
                                </div>
                            );
                        })}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground/70 ml-1">
                            <span className="flex items-center gap-0.5"><BookOpen className="h-3 w-3" /> 수업</span>
                            <span className="flex items-center gap-0.5"><FileText className="h-3 w-3" /> 과제</span>
                            <span className="flex items-center gap-0.5"><ClipboardCheck className="h-3 w-3" /> 시험</span>
                            <span className="flex items-center gap-0.5"><School className="h-3 w-3" /> 학교일정</span>
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="p-0">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {viewMode === "month" && renderMonth()}
                        {viewMode === "week" && renderWeek()}
                        {viewMode === "day" && renderDay()}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
