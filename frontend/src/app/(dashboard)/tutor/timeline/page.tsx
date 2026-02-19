"use client";

import { useState, useEffect } from "react";
import {
    BookOpen,
    ClipboardCheck,
    FileText,
    Clock,
    Filter,
    Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
    getChildTimeline,
    getTutorDashboard,
    type TimelineEntry,
    type DashboardChild,
} from "@/lib/api/tutor";

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
    lesson: { icon: BookOpen, label: "수업", color: "text-blue-500" },
    test: { icon: ClipboardCheck, label: "시험", color: "text-purple-500" },
    assignment: { icon: FileText, label: "과제", color: "text-orange-500" },
};

function TimelineItem({ entry }: { entry: TimelineEntry }) {
    const config = typeConfig[entry.type] || typeConfig.lesson;
    const Icon = config.icon;

    return (
        <div className="flex gap-4 relative">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-current ${config.color} shadow-sm`}
                >
                    <Icon className="h-5 w-5" />
                </div>
                <div className="w-0.5 flex-1 bg-border mt-2" />
            </div>

            {/* Content */}
            <Card className="flex-1 mb-4 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge
                                    variant={
                                        entry.type === "test"
                                            ? "default"
                                            : entry.type === "assignment"
                                                ? "warning"
                                                : "secondary"
                                    }
                                >
                                    {config.label}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {entry.className}
                                </span>
                            </div>
                            <h3 className="font-medium">{entry.title}</h3>
                            {entry.summary && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {entry.summary}
                                </p>
                            )}
                            {entry.pages && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    📖 {entry.pages}페이지
                                </p>
                            )}
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="text-xs text-muted-foreground">
                                {new Date(entry.date).toLocaleDateString("ko-KR")}
                            </p>
                            {entry.type === "test" && entry.score !== undefined && (
                                <p className="text-lg font-bold text-primary mt-1">
                                    {entry.score}/{entry.maxScore}
                                </p>
                            )}
                            {entry.type === "assignment" && entry.status && (
                                <Badge
                                    variant={
                                        entry.status === "submitted" || entry.status === "graded"
                                            ? "success"
                                            : "warning"
                                    }
                                    className="mt-1"
                                >
                                    {entry.status === "submitted"
                                        ? "제출"
                                        : entry.status === "graded"
                                            ? "채점완료"
                                            : "미제출"}
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function TimelinePage() {
    const [children, setChildren] = useState<DashboardChild[]>([]);
    const [selectedChild, setSelectedChild] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>("all");

    // 자녀 목록 로드
    useEffect(() => {
        async function loadChildren() {
            try {
                const data = await getTutorDashboard();
                setChildren(data.children || []);
                if (data.children?.length > 0) {
                    setSelectedChild(data.children[0].student.id);
                }
            } catch (err) {
                console.error("Failed to load children:", err);
            } finally {
                setLoading(false);
            }
        }
        loadChildren();
    }, []);

    // 타임라인 로드
    useEffect(() => {
        if (!selectedChild) return;
        async function loadTimeline() {
            try {
                setLoading(true);
                const data = await getChildTimeline(
                    selectedChild,
                    selectedClass || undefined
                );
                setTimeline(data);
            } catch (err) {
                console.error("Failed to load timeline:", err);
                setTimeline([]);
            } finally {
                setLoading(false);
            }
        }
        loadTimeline();
    }, [selectedChild, selectedClass]);

    const filteredTimeline =
        filterType === "all"
            ? timeline
            : timeline.filter((t) => t.type === filterType);

    const selectedChildData = children.find(
        (c) => c.student.id === selectedChild
    );

    if (loading && children.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* 헤더 */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Clock className="h-6 w-6 text-primary" />
                    학습 타임라인
                </h1>
                <p className="text-muted-foreground">
                    자녀의 수업, 시험, 과제를 시간순으로 확인하세요
                </p>
            </div>

            {/* 필터 영역 */}
            <div className="flex flex-wrap items-center gap-4">
                {/* 자녀 선택 */}
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-muted-foreground">자녀:</label>
                    <div className="w-48">
                        <Select
                            options={children.map((c) => ({
                                value: c.student.id,
                                label: c.student.username,
                            }))}
                            value={selectedChild}
                            onChange={(e) => {
                                setSelectedChild(e.target.value);
                                setSelectedClass("");
                            }}
                        />
                    </div>
                </div>

                {/* 수업 선택 */}
                {selectedChildData && (
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground">수업:</label>
                        <div className="w-48">
                            <Select
                                options={[
                                    { value: "", label: "전체 수업" },
                                    ...selectedChildData.classes.map((c) => ({
                                        value: c.id,
                                        label: c.name,
                                    })),
                                ]}
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* 타입 필터 */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <div className="flex gap-1">
                        {[
                            { value: "all", label: "전체" },
                            { value: "lesson", label: "수업" },
                            { value: "test", label: "시험" },
                            { value: "assignment", label: "과제" },
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilterType(opt.value)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filterType === opt.value
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 타임라인 */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : filteredTimeline.length > 0 ? (
                <div className="relative">
                    {filteredTimeline.map((entry, i) => (
                        <TimelineItem key={i} entry={entry} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-sm text-muted-foreground py-12">
                    타임라인 항목이 없습니다
                </div>
            )}
        </div>
    );
}
