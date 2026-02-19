"use client";

import { useState, useEffect } from "react";
import {
    TrendingUp,
    Loader2,
    Award,
    ArrowUp,
    ArrowDown,
    Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend,
} from "recharts";
import {
    getChildTestTrend,
    getTutorDashboard,
    type TestTrendEntry,
    type DashboardChild,
} from "@/lib/api/tutor";

export default function TestTrendPage() {
    const [children, setChildren] = useState<DashboardChild[]>([]);
    const [selectedChild, setSelectedChild] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [trends, setTrends] = useState<TestTrendEntry[]>([]);
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
        async function loadTrends() {
            try {
                setLoading(true);
                const data = await getChildTestTrend(
                    selectedChild,
                    selectedClass || undefined
                );
                setTrends(data);
            } catch (err) {
                console.error("Failed to load test trends:", err);
                setTrends([]);
            } finally {
                setLoading(false);
            }
        }
        loadTrends();
    }, [selectedChild, selectedClass]);

    const selectedChildData = children.find(
        (c) => c.student.id === selectedChild
    );

    // 통계 계산
    const stats = trends.length > 0
        ? {
            avg: Math.round(
                trends.reduce((sum, t) => sum + t.percentage, 0) / trends.length
            ),
            max: Math.max(...trends.map((t) => t.percentage)),
            min: Math.min(...trends.map((t) => t.percentage)),
            latest: trends[trends.length - 1]?.percentage || 0,
            prevLatest: trends.length > 1 ? trends[trends.length - 2]?.percentage : null,
        }
        : null;

    const chartData = trends.map((t) => ({
        name: t.testTitle.length > 8 ? t.testTitle.slice(0, 8) + "…" : t.testTitle,
        점수: t.percentage,
        fullTitle: t.testTitle,
        className: t.className,
        score: t.score,
        maxScore: t.maxScore,
        date: t.date,
    }));

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
                    <TrendingUp className="h-6 w-6 text-primary" />
                    시험 성적 추이
                </h1>
                <p className="text-muted-foreground">
                    자녀의 시험 성적 변화를 한눈에 확인하세요
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

            {/* 통계 카드 */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                        <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">평균</p>
                            <p className="text-3xl font-bold text-primary">{stats.avg}점</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                        <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                                <ArrowUp className="h-3 w-3" /> 최고
                            </p>
                            <p className="text-3xl font-bold text-success">{stats.max}점</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
                        <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
                                <ArrowDown className="h-3 w-3" /> 최저
                            </p>
                            <p className="text-3xl font-bold text-warning">{stats.min}점</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <p className="text-xs text-muted-foreground mb-1">최근 점수</p>
                            <p className="text-3xl font-bold">{stats.latest}점</p>
                            {stats.prevLatest !== null && (
                                <p className={`text-xs mt-1 flex items-center justify-center gap-1 ${stats.latest > stats.prevLatest
                                    ? "text-success"
                                    : stats.latest < stats.prevLatest
                                        ? "text-destructive"
                                        : "text-muted-foreground"
                                    }`}>
                                    {stats.latest > stats.prevLatest ? (
                                        <ArrowUp className="h-3 w-3" />
                                    ) : stats.latest < stats.prevLatest ? (
                                        <ArrowDown className="h-3 w-3" />
                                    ) : (
                                        <Minus className="h-3 w-3" />
                                    )}
                                    {Math.abs(stats.latest - stats.prevLatest)}점
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 차트 */}
            {loading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : chartData.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Award className="h-4 w-4 text-primary" />
                            성적 변화 그래프
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 12 }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        tick={{ fontSize: 12 }}
                                        stroke="var(--muted-foreground)"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "var(--card)",
                                            border: "1px solid var(--border)",
                                            borderRadius: "8px",
                                            fontSize: "13px",
                                        }}
                                        formatter={((value: any, name: any, props: any) => {
                                            const item = props.payload;
                                            return [
                                                `${item.score}/${item.maxScore} (${value ?? 0}%)`,
                                                item.fullTitle,
                                            ];
                                        }) as any}
                                        labelFormatter={() => ""}
                                    />
                                    <Legend />
                                    {stats && (
                                        <ReferenceLine
                                            y={stats.avg}
                                            stroke="var(--primary)"
                                            strokeDasharray="5 5"
                                            label={{
                                                value: `평균 ${stats.avg}점`,
                                                position: "right",
                                                fill: "var(--primary)",
                                                fontSize: 11,
                                            }}
                                        />
                                    )}
                                    <Line
                                        type="monotone"
                                        dataKey="점수"
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        dot={{
                                            fill: "var(--primary)",
                                            r: 5,
                                            strokeWidth: 2,
                                            stroke: "#fff",
                                        }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center text-sm text-muted-foreground py-12">
                    시험 데이터가 없습니다
                </div>
            )}

            {/* 시험 목록 */}
            {trends.length > 0 && (
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">시험 목록</h2>
                    {trends.map((t, i) => (
                        <Card key={i} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium">{t.testTitle}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {t.className} · {new Date(t.date).toLocaleDateString("ko-KR")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-primary">{t.percentage}점</p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.score}/{t.maxScore}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
