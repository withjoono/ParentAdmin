"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Sparkles,
    Link2,
    BookOpen,
    MessageCircle,
    FileText,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { config } from "@/lib/config";
import { getDashboard } from "@/lib/api/parent";

const STORAGE_KEY = "onboarding_done_v1";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [linked, setLinked] = useState(false);
    const [polling, setPolling] = useState(false);
    const [pollMessage, setPollMessage] = useState("");

    // 폴링: 3단계로 들어오면 5초 간격, 최대 24회(=2분)
    const checkLinkage = useCallback(async () => {
        try {
            const data = await getDashboard();
            const count = data.children?.length ?? 0;
            if (count > 0) {
                setLinked(true);
                setPollMessage(`자녀 ${count}명이 연동됐어요!`);
                return true;
            }
        } catch {}
        return false;
    }, []);

    useEffect(() => {
        if (step !== 2 || linked) return;
        setPolling(true);
        let tries = 0;
        let cancelled = false;
        const tick = async () => {
            if (cancelled) return;
            const ok = await checkLinkage();
            tries += 1;
            if (ok || tries >= 24) {
                setPolling(false);
                return;
            }
            setTimeout(tick, 5000);
        };
        tick();
        return () => {
            cancelled = true;
            setPolling(false);
        };
    }, [step, linked, checkLinkage]);

    function finish() {
        try {
            window.localStorage.setItem(STORAGE_KEY, "1");
        } catch {}
        router.push("/");
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-background">
            <div className="mx-auto max-w-3xl px-6 py-12">
                {/* 진행 표시 */}
                <div className="mb-8 flex items-center justify-center gap-2">
                    {[0, 1, 2, 3].map((i) => (
                        <span
                            key={i}
                            className={`h-1.5 w-10 rounded-full transition-colors ${
                                i <= step ? "bg-primary" : "bg-muted"
                            }`}
                        />
                    ))}
                </div>

                {step === 0 && (
                    <StepCard
                        badge="환영합니다"
                        icon={<Sparkles className="h-7 w-7" />}
                        title="자녀의 학습을 한 곳에서 보세요"
                        body={
                            <>
                                수업·과제·시험·급식·시간표까지, 학교와 학원의 학습 정보를
                                <br className="hidden sm:inline" /> 한 화면에서 통합 조회합니다.
                            </>
                        }
                        primary={{ label: "다음", onClick: () => setStep(1) }}
                    />
                )}

                {step === 1 && (
                    <StepCard
                        badge="1단계 — 자녀 연동"
                        icon={<Link2 className="h-7 w-7" />}
                        title="먼저 자녀 계정과 연결해 주세요"
                        body={
                            <>
                                자녀가 <strong>거북스쿨</strong>에 가입돼 있어야 합니다.
                                <br />
                                자녀 ID 또는 가입 이메일이 필요해요.
                            </>
                        }
                        extra={
                            <Card className="bg-muted/40 p-3 text-xs text-muted-foreground">
                                자녀가 아직 가입을 안 했나요?{" "}
                                <a
                                    href={`${config.hubUrl}/auth/register`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary font-medium hover:underline inline-flex items-center gap-0.5"
                                >
                                    자녀 가입 안내
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </Card>
                        }
                        secondary={{ label: "뒤로", onClick: () => setStep(0) }}
                        primary={{
                            label: "자녀 연동하기",
                            href: `${config.hubUrl}/account-linkage`,
                            external: true,
                            onClick: () => setStep(2),
                        }}
                    />
                )}

                {step === 2 && (
                    <StepCard
                        badge="2단계 — 연동 확인"
                        icon={
                            linked ? (
                                <CheckCircle2 className="h-7 w-7 text-success" />
                            ) : polling ? (
                                <Loader2 className="h-7 w-7 animate-spin" />
                            ) : (
                                <Link2 className="h-7 w-7" />
                            )
                        }
                        title={linked ? "연동이 완료됐어요!" : "자녀 연동을 기다리고 있어요"}
                        body={
                            linked ? (
                                <>{pollMessage}</>
                            ) : (
                                <>
                                    새 탭에서 자녀 연결이 끝나면 자동으로 다음 단계로 넘어가요.
                                    <br />
                                    {polling
                                        ? "5초마다 자동으로 확인 중…"
                                        : "타임아웃됐어요. 직접 다시 확인해 주세요."}
                                </>
                            )
                        }
                        extra={
                            !linked && (
                                <TroubleshootingBox />
                            )
                        }
                        secondary={{ label: "뒤로", onClick: () => setStep(1) }}
                        primary={
                            linked
                                ? { label: "다음", onClick: () => setStep(3) }
                                : {
                                      label: polling ? "확인 중…" : "다시 확인",
                                      onClick: async () => {
                                          if (polling) return;
                                          setPolling(true);
                                          const ok = await checkLinkage();
                                          setPolling(false);
                                          if (ok) setStep(3);
                                      },
                                  }
                        }
                    />
                )}

                {step === 3 && (
                    <StepCard
                        badge="3단계 — 핵심 기능 미리보기"
                        icon={<Sparkles className="h-7 w-7" />}
                        title="이런 기능을 쓸 수 있어요"
                        body={
                            <div className="grid gap-3 sm:grid-cols-3 mt-2">
                                <FeatureTile
                                    icon={<BookOpen className="h-5 w-5" />}
                                    title="대시보드"
                                    body="자녀별 진도·시험·급식·시간표를 한 화면에"
                                />
                                <FeatureTile
                                    icon={<MessageCircle className="h-5 w-5" />}
                                    title="선생님 대화"
                                    body="자녀 담당 선생님과 1:1로 메시지를 주고받습니다"
                                />
                                <FeatureTile
                                    icon={<FileText className="h-5 w-5" />}
                                    title="수업 기록"
                                    body="출결·과제·시험을 수업별로 통합 조회"
                                />
                            </div>
                        }
                        secondary={{ label: "뒤로", onClick: () => setStep(2) }}
                        primary={{ label: "대시보드로 가기", onClick: finish }}
                    />
                )}

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-[11px] text-muted-foreground hover:underline"
                    >
                        나중에 하기
                    </Link>
                </div>
            </div>
        </main>
    );
}

// ===== sub-components =====

function StepCard({
    badge,
    icon,
    title,
    body,
    extra,
    primary,
    secondary,
}: {
    badge: string;
    icon: React.ReactNode;
    title: string;
    body: React.ReactNode;
    extra?: React.ReactNode;
    primary?: {
        label: string;
        onClick?: () => void;
        href?: string;
        external?: boolean;
    };
    secondary?: { label: string; onClick: () => void };
}) {
    return (
        <Card className="p-8 sm:p-10">
            <div className="text-center">
                <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-2xl bg-primary/10 text-primary p-3">
                    {icon}
                </div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {badge}
                </div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                <div className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {body}
                </div>
            </div>
            {extra && <div className="mt-6">{extra}</div>}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-center gap-2">
                {secondary && (
                    <Button variant="outline" onClick={secondary.onClick} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        {secondary.label}
                    </Button>
                )}
                {primary &&
                    (primary.href ? (
                        <a
                            href={primary.href}
                            target={primary.external ? "_blank" : undefined}
                            rel={primary.external ? "noopener noreferrer" : undefined}
                            onClick={primary.onClick}
                            className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                        >
                            {primary.label}
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    ) : (
                        <Button onClick={primary.onClick} className="gap-1">
                            {primary.label}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ))}
            </div>
        </Card>
    );
}

function FeatureTile({
    icon,
    title,
    body,
}: {
    icon: React.ReactNode;
    title: string;
    body: string;
}) {
    return (
        <div className="rounded-lg border bg-card p-4 text-left">
            <div className="mb-2 inline-flex items-center justify-center rounded-md bg-primary/10 text-primary p-1.5">
                {icon}
            </div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body}</p>
        </div>
    );
}

function TroubleshootingBox() {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-lg border bg-card text-left text-xs">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between px-3 py-2 font-medium hover:bg-muted"
            >
                연동이 안 되나요?
                <span className="text-muted-foreground">{open ? "닫기" : "열기"}</span>
            </button>
            {open && (
                <div className="border-t px-3 py-3 space-y-2 text-muted-foreground leading-relaxed">
                    <p>• 자녀가 거북스쿨(tskool.kr)에 먼저 가입돼 있어야 합니다.</p>
                    <p>• 자녀가 가입 시 사용한 이메일/ID로 연결해 주세요.</p>
                    <p>• 새 탭이 차단됐다면, 위 버튼을 다시 눌러 팝업을 허용해 주세요.</p>
                    <p>• 연동 후에도 이 화면이 계속 보이면 새로고침해 주세요.</p>
                </div>
            )}
        </div>
    );
}
