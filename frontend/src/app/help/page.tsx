"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Search,
    Rocket,
    LayoutDashboard,
    School,
    FileText,
    MessageCircle,
    CreditCard,
    ChevronDown,
    ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
    {
        slug: "start",
        icon: Rocket,
        title: "시작하기",
        desc: "가입 · 로그인 · 자녀 연동",
        color: "bg-blue-50 text-blue-700",
    },
    {
        slug: "dashboard",
        icon: LayoutDashboard,
        title: "대시보드",
        desc: "위젯 읽는 법, 색상의 의미",
        color: "bg-emerald-50 text-emerald-700",
    },
    {
        slug: "school",
        icon: School,
        title: "학교 정보",
        desc: "급식 · 시간표 · 학사일정 · NEIS 한계",
        color: "bg-amber-50 text-amber-700",
    },
    {
        slug: "records",
        icon: FileText,
        title: "수업 기록",
        desc: "출결 · 과제 · 시험 배지 의미",
        color: "bg-rose-50 text-rose-700",
    },
    {
        slug: "chat",
        icon: MessageCircle,
        title: "선생님과 대화하기",
        desc: "메시지 · 알림",
        color: "bg-purple-50 text-purple-700",
    },
    {
        slug: "account",
        icon: CreditCard,
        title: "계정 · 결제",
        desc: "이용권 · 자녀 해제 · 로그아웃",
        color: "bg-slate-50 text-slate-700",
    },
] as const;

const FAQS: { q: string; a: string; tags: string[] }[] = [
    {
        q: "자녀가 거북스쿨에 가입돼 있지 않으면 어떻게 하나요?",
        a: "먼저 자녀가 tskool.kr에서 가입을 마쳐야 합니다. 학부모앱은 가입된 자녀 계정과의 연결을 전제로 동작해요.",
        tags: ["start"],
    },
    {
        q: "자녀가 여러 명인데 모두 연결할 수 있나요?",
        a: "네. Hub의 계정연동(account-linkage)에서 자녀를 한 명씩 추가하면 대시보드에 모두 표시됩니다.",
        tags: ["start", "dashboard"],
    },
    {
        q: "학교 급식이 안 보여요. 왜 그런가요?",
        a: "NEIS 공공데이터에 학교가 등록되지 않았거나, 식단 게시가 지연된 경우입니다. 며칠 후 다시 확인해 주세요.",
        tags: ["school"],
    },
    {
        q: "학원 수업이 안 보여요.",
        a: "담당 선생님이 거북스쿨 튜터보드(TutorBoard)를 사용해 수업 일정을 기록해야 학부모앱에 표시됩니다.",
        tags: ["records"],
    },
    {
        q: "자녀가 제 메시지를 보나요?",
        a: "선생님 ↔ 학부모 채팅은 자녀가 자녀앱에서 조회할 수 있는 화면이 아닙니다.",
        tags: ["chat"],
    },
    {
        q: "자녀가 보내는 학습 결과는 실시간인가요?",
        a: "선생님 또는 자녀가 데이터를 입력·제출하는 즉시 백엔드에 반영되며, 대시보드는 페이지 진입 시 최신값을 조회합니다.",
        tags: ["dashboard"],
    },
    {
        q: "비밀번호를 잊었어요.",
        a: "tskool.kr 로그인 화면의 '비밀번호 찾기'를 이용해 주세요. 학부모앱 자체 비밀번호는 없습니다(중앙 SSO).",
        tags: ["account"],
    },
    {
        q: "한 자녀를 해제하고 싶어요.",
        a: "Hub의 계정연동 화면에서 자녀 연결을 해제할 수 있습니다. 해제 즉시 학부모앱 대시보드에서 사라져요.",
        tags: ["start", "account"],
    },
    {
        q: "이용권은 어떻게 사나요?",
        a: "헤더 오른쪽 💳 아이콘 또는 사용자 메뉴의 '결제내역'에서 tskool.kr 상품 페이지로 이동해 구매할 수 있습니다.",
        tags: ["account"],
    },
    {
        q: "알림이 너무 자주 와요.",
        a: "사용자 메뉴 → 마이페이지에서 알림 설정을 조정할 수 있습니다(추후 학부모앱에서도 인앱 설정이 추가될 예정).",
        tags: ["chat"],
    },
    {
        q: "학년이 바뀌면 자동으로 반영되나요?",
        a: "자녀가 거북스쿨에서 학교/학년 정보를 업데이트하면 학부모앱 대시보드에서도 즉시 반영됩니다.",
        tags: ["school"],
    },
    {
        q: "자녀 두 명이 학교가 다른데 어떻게 보이나요?",
        a: "자녀마다 별도의 카드가 만들어지고, 각 카드의 학교 위젯(급식·시간표·학사일정)은 자녀별 학교를 따로 조회합니다.",
        tags: ["school", "dashboard"],
    },
];

export default function HelpPage() {
    const [query, setQuery] = useState("");

    const filteredFaqs = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return FAQS;
        return FAQS.filter(
            (f) =>
                f.q.toLowerCase().includes(q) ||
                f.a.toLowerCase().includes(q) ||
                f.tags.some((t) => t.includes(q))
        );
    }, [query]);

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-5xl px-6 py-10">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">도움말</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        궁금한 점을 카테고리에서 찾거나 아래에서 검색해 보세요.
                    </p>
                </header>

                {/* 검색 */}
                <div className="mx-auto mb-10 max-w-xl relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="궁금한 키워드를 입력하세요"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full rounded-xl border bg-card pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>

                {/* 카테고리 */}
                <section className="mb-10">
                    <h2 className="mb-3 text-sm font-semibold text-muted-foreground">카테고리</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {CATEGORIES.map((c) => {
                            const Icon = c.icon;
                            return (
                                <Link key={c.slug} href={`/help/${c.slug}`}>
                                    <Card className="p-4 hover:shadow-md transition-shadow h-full">
                                        <div className="flex items-start gap-3">
                                            <div className={`rounded-lg p-2 ${c.color}`}>
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold">{c.title}</p>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {c.desc}
                                                </p>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* FAQ */}
                <section>
                    <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                        자주 묻는 질문{" "}
                        <span className="text-xs">({filteredFaqs.length}건)</span>
                    </h2>
                    <div className="space-y-2">
                        {filteredFaqs.map((f, i) => (
                            <FaqItem key={i} q={f.q} a={f.a} />
                        ))}
                        {filteredFaqs.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-8">
                                결과가 없습니다. 다른 키워드로 검색해 보세요.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <Card>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left"
            >
                <span className="text-sm font-medium">{q}</span>
                <ChevronDown
                    className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>
            {open && (
                <div className="px-4 pb-4 -mt-1 text-sm text-muted-foreground leading-relaxed">
                    {a}
                </div>
            )}
        </Card>
    );
}
