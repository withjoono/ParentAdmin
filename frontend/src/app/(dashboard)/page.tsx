"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    FileText,
    ClipboardCheck,
    ArrowRight,
    User,
    Loader2,
    CheckCircle,
    Clock as ClockIcon,
    XCircle,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { getTutorDashboard, type DashboardChild } from "@/lib/api/tutor";
import { getLinkedAccounts, type LinkedAccount } from "@/lib/api/hub";
import { APP_LABELS, openStudentApp } from "@/lib/app-viewer";

// ==================== 컴포넌트 ====================

function AttendanceIcon({ status }: { status: string }) {
    switch (status) {
        case "present":
            return <CheckCircle className="h-3.5 w-3.5 text-success" />;
        case "late":
            return <ClockIcon className="h-3.5 w-3.5 text-warning" />;
        case "absent":
            return <XCircle className="h-3.5 w-3.5 text-destructive" />;
        default:
            return null;
    }
}

function ChildCard({ child, sharedApps }: { child: DashboardChild; sharedApps: string[] }) {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/30">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg">
                                {child.student.username}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {child.classes.length}개 수업
                            </p>
                        </div>
                    </div>
                    {child.pendingAssignments > 0 && (
                        <Badge variant="warning">미제출 {child.pendingAssignments}</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* 수업 목록 */}
                <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        수업 목록
                    </p>
                    <div className="space-y-1">
                        {child.classes.map((cls) => (
                            <div
                                key={cls.id}
                                className="flex items-center justify-between text-sm px-2 py-1.5 rounded-md bg-muted/50"
                            >
                                <span className="font-medium">{cls.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {cls.teacher.username} 선생님
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 오늘 출결 */}
                <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        오늘 출결
                    </p>
                    {child.todayAttendance.length > 0 ? (
                        <div className="space-y-1">
                            {child.todayAttendance.map((att, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-2 text-sm px-2 py-1"
                                >
                                    <AttendanceIcon status={att.status} />
                                    <span>{att.class.name}</span>
                                    <Badge
                                        variant={
                                            att.status === "present"
                                                ? "success"
                                                : att.status === "late"
                                                    ? "warning"
                                                    : "destructive"
                                        }
                                        className="text-[10px] px-1.5 py-0"
                                    >
                                        {att.status === "present"
                                            ? "출석"
                                            : att.status === "late"
                                                ? "지각"
                                                : "결석"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground px-2">
                            오늘 출결 기록이 없습니다
                        </p>
                    )}
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

                {/* 자녀 앱 열기 */}
                {sharedApps.length > 0 && (
                    <div className="space-y-2 pt-2">
                        <p className="text-xs font-medium text-muted-foreground">앱 열기</p>
                        <div className="flex flex-wrap gap-1.5">
                            {sharedApps.map((appKey) => {
                                const label = APP_LABELS[appKey];
                                return (
                                    <button
                                        key={appKey}
                                        onClick={() => openStudentApp(appKey, child.student.id)}
                                        className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1.5 text-xs font-medium shadow-sm hover:bg-accent hover:shadow-md transition-all"
                                        title={`${label?.name || appKey}을(를) 자녀 시점으로 열기`}
                                    >
                                        <span>{label?.emoji || '📱'}</span>
                                        <span>{label?.name || appKey}</span>
                                        <ExternalLink className="w-3 h-3 opacity-50" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 상세보기 버튼들 */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <Link href={`/tutor/timeline?childId=${child.student.id}`}>
                        <Button
                            variant="outline"
                            className="w-full text-xs h-8"
                        >
                            타임라인
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                    <Link href={`/tutor/class-records?childId=${child.student.id}`}>
                        <Button
                            variant="outline"
                            className="w-full text-xs h-8"
                        >
                            수업 기록
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
    const [children, setChildren] = useState<DashboardChild[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [sharedAppsMap, setSharedAppsMap] = useState<Record<string, string[]>>({});

    useEffect(() => {
        async function fetchDashboard() {
            try {
                setLoading(true);
                const data = await getTutorDashboard();
                setChildren(data.children || []);

                // 공유 앱 목록 조회 (Hub API)
                try {
                    const links = await getLinkedAccounts();
                    const map: Record<string, string[]> = {};
                    (Array.isArray(links) ? links : []).forEach((link: LinkedAccount) => {
                        if (link.partnerType === 'student' && link.sharedApps?.length) {
                            map[link.partnerId] = link.sharedApps;
                        }
                    });
                    setSharedAppsMap(map);
                } catch {
                    // Hub API 실패해도 기본 기능 유지
                }
            } catch (err) {
                console.error("Failed to fetch dashboard:", err);
                setChildren([]);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const totalPending = children.reduce(
        (sum, c) => sum + c.pendingAssignments,
        0
    );

    return (
        <div className="p-6 space-y-6">
            {/* 인사 헤더 */}
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight">
                    👋 안녕하세요, 학부모님
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
                            <p className="text-2xl font-bold">{children.length}명</p>
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
                            <p className="text-2xl font-bold">{totalPending}건</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
                            <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">총 수업</p>
                            <p className="text-2xl font-bold">
                                {children.reduce(
                                    (sum, c) => sum + c.classes.length,
                                    0
                                )}
                                개
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 자녀 전환 탭 */}
            {children.length > 1 && (
                <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
                    {children.map((child, i) => (
                        <button
                            key={child.student.id}
                            onClick={() => setActiveTab(i)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === i
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {child.student.username}
                        </button>
                    ))}
                </div>
            )}

            {/* 자녀별 카드 */}
            <div>
                <h2 className="text-lg font-semibold mb-4">
                    {children.length > 1 ? "자녀 현황" : "자녀별 현황"}
                </h2>
                {children.length > 1 ? (
                    // 탭 모드: 선택된 자녀만 표시
                    <ChildCard child={children[activeTab]} sharedApps={sharedAppsMap[children[activeTab]?.student.id] || []} />
                ) : children.length === 1 ? (
                    <ChildCard child={children[0]} sharedApps={sharedAppsMap[children[0]?.student.id] || []} />
                ) : (
                    <div className="text-center text-sm text-muted-foreground py-8">
                        등록된 자녀 정보가 없습니다
                    </div>
                )}
            </div>

            {/* 빠른 링크 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link href="/tutor/timeline">
                    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                        <CardContent className="p-4 text-center">
                            <ClockIcon className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                            <p className="text-sm font-medium">학습 타임라인</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tutor/test-trend">
                    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                        <CardContent className="p-4 text-center">
                            <ClipboardCheck className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                            <p className="text-sm font-medium">성적 추이</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tutor/comments">
                    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                        <CardContent className="p-4 text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <p className="text-sm font-medium">선생님 대화</p>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/tutor/class-records">
                    <Card className="hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
                        <CardContent className="p-4 text-center">
                            <BookOpen className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <p className="text-sm font-medium">수업 기록</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}
