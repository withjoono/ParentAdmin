"use client";

import { useState, useEffect } from "react";
import {
    BookOpen,
    Loader2,
    CheckCircle,
    Clock,
    XCircle,
    FileText,
    ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
    getChildClassRecords,
    getTutorDashboard,
    type ClassRecordGroup,
    type DashboardChild,
} from "@/lib/api/tutor";

function AttendanceBadge({ status }: { status: string | null }) {
    if (!status) return <span className="text-xs text-muted-foreground">—</span>;
    switch (status) {
        case "present":
            return (
                <Badge variant="success" className="gap-1">
                    <CheckCircle className="h-3 w-3" /> 출석
                </Badge>
            );
        case "late":
            return (
                <Badge variant="warning" className="gap-1">
                    <Clock className="h-3 w-3" /> 지각
                </Badge>
            );
        case "absent":
            return (
                <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" /> 결석
                </Badge>
            );
        default:
            return <span className="text-xs text-muted-foreground">{status}</span>;
    }
}

export default function ClassRecordsPage() {
    const [children, setChildren] = useState<DashboardChild[]>([]);
    const [selectedChild, setSelectedChild] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [records, setRecords] = useState<ClassRecordGroup[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        if (!selectedChild) return;
        async function loadRecords() {
            try {
                setLoading(true);
                const data = await getChildClassRecords(
                    selectedChild,
                    selectedClass || undefined
                );
                setRecords(data);
            } catch (err) {
                console.error("Failed to load class records:", err);
                setRecords([]);
            } finally {
                setLoading(false);
            }
        }
        loadRecords();
    }, [selectedChild, selectedClass]);

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
                    <BookOpen className="h-6 w-6 text-primary" />
                    수업 기록
                </h1>
                <p className="text-muted-foreground">
                    자녀의 수업별 기록을 확인하세요 (출결, 내용, 과제, 테스트)
                </p>
            </div>

            {/* 필터 */}
            <div className="flex flex-wrap items-center gap-4">
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
            </div>

            {/* 수업별 기록 */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : records.length > 0 ? (
                records.map((group) => (
                    <Card key={group.classId}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                {group.className}
                                <Badge variant="secondary">{group.subject}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {group.records.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-left">
                                                <th className="pb-2 pr-4 font-medium text-muted-foreground whitespace-nowrap">
                                                    날짜
                                                </th>
                                                <th className="pb-2 pr-4 font-medium text-muted-foreground whitespace-nowrap">
                                                    출결
                                                </th>
                                                <th className="pb-2 pr-4 font-medium text-muted-foreground">
                                                    수업 내용
                                                </th>
                                                <th className="pb-2 pr-4 font-medium text-muted-foreground whitespace-nowrap">
                                                    과제
                                                </th>
                                                <th className="pb-2 font-medium text-muted-foreground whitespace-nowrap">
                                                    테스트
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.records.map((record, i) => (
                                                <tr
                                                    key={i}
                                                    className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                                                >
                                                    <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                                                        {new Date(record.date).toLocaleDateString("ko-KR", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <AttendanceBadge status={record.attendance} />
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <div>
                                                            <p className="font-medium">
                                                                {record.lessonTitle}
                                                            </p>
                                                            {record.summary && (
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    {record.summary}
                                                                </p>
                                                            )}
                                                            {record.pages && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    📖 p.{record.pages}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {record.assignments.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {record.assignments.map((a, j) => (
                                                                    <div key={j} className="flex items-center gap-1.5">
                                                                        <FileText className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-xs">{a.title}</span>
                                                                        <Badge
                                                                            variant={
                                                                                a.status === "graded"
                                                                                    ? "success"
                                                                                    : a.status === "submitted"
                                                                                        ? "default"
                                                                                        : "warning"
                                                                            }
                                                                            className="text-[10px] px-1.5 py-0"
                                                                        >
                                                                            {a.status === "graded"
                                                                                ? `${a.grade}점`
                                                                                : a.status === "submitted"
                                                                                    ? "제출"
                                                                                    : "미제출"}
                                                                        </Badge>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="py-3">
                                                        {record.tests.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {record.tests.map((t, j) => (
                                                                    <div key={j} className="flex items-center gap-1.5">
                                                                        <ClipboardCheck className="h-3 w-3 text-muted-foreground" />
                                                                        <span className="text-xs">{t.title}</span>
                                                                        {t.score !== null && t.score !== undefined ? (
                                                                            <Badge variant="default" className="text-[10px] px-1.5 py-0">
                                                                                {t.score}/{t.maxScore}
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                                                미응시
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    수업 기록이 없습니다
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center text-sm text-muted-foreground py-12">
                    수업 기록이 없습니다
                </div>
            )}
        </div>
    );
}
