"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Eye,
    BookOpen,
    FileText,
    GraduationCap,
    Trophy,
    Users,
    MessageSquareLock,
    Shield,
    Swords,
    ArrowRight,
    ChevronDown,
    Star,
    Sparkles,
    Clock,
    Target,
    MessageCircle,
    Bell,
} from "lucide-react";
import { Footer } from "@/components/footer";

/* ─────────────────────────────────────
   Animation hook — fade-in on scroll
   ───────────────────────────────────── */
function useScrollReveal() {
    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("animate-visible");
                        io.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        document.querySelectorAll(".scroll-reveal").forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
}

/* ─────────────────────────────────────
   Sub-components
   ───────────────────────────────────── */

function FeatureCard({
    icon: Icon,
    title,
    desc,
    color,
}: {
    icon: any;
    title: string;
    desc: string;
    color: string;
}) {
    return (
        <div className="group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-center transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl">
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} transition-transform duration-300 group-hover:scale-110`}
            >
                <Icon className="h-7 w-7 text-white" />
            </div>
            <h4 className="text-[15px] font-bold text-white">{title}</h4>
            <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
        </div>
    );
}

function AppBadge({ name, icon: Icon }: { name: string; icon: any }) {
    return (
        <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 text-sm font-medium text-white/90 transition-all hover:bg-white/20 hover:border-white/20 hover:scale-105">
            <Icon className="h-4 w-4" />
            {name}
        </div>
    );
}

function StatCard({ number, label }: { number: string; label: string }) {
    return (
        <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                {number}
            </p>
            <p className="mt-1 text-sm text-white/50">{label}</p>
        </div>
    );
}

/* ─────────────────────────────────────
   Main Promo Page
   ───────────────────────────────────── */
export default function PromoPage() {
    const [heroLoaded, setHeroLoaded] = useState(false);
    useScrollReveal();

    useEffect(() => {
        setHeroLoaded(true);
    }, []);

    return (
        <>
            {/* ═══════════════════════════════════════
                GLOBAL CSS for this page
                ═══════════════════════════════════════ */}
            <style jsx global>{`
                .scroll-reveal {
                    opacity: 0;
                    transform: translateY(32px);
                    transition: opacity 0.7s ease, transform 0.7s ease;
                }
                .animate-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(217,70,239,0.2); }
                    50% { box-shadow: 0 0 40px rgba(217,70,239,0.4); }
                }
                .float-animation { animation: float 6s ease-in-out infinite; }
                .float-animation-delay { animation: float 6s ease-in-out 1.5s infinite; }
                .glow-pulse { animation: pulse-glow 3s ease-in-out infinite; }
            `}</style>

            {/* ═══════════════════════════════════════
                HERO SECTION
                ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1a] via-[#1a1035] to-[#120e20] text-white">
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-fuchsia-600/15 blur-[120px]" />
                    <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
                    <div className="absolute bottom-0 left-1/3 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[80px]" />
                </div>

                <div className="relative mx-auto max-w-screen-lg px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
                    {/* Badge */}
                    <div
                        className={`flex justify-center transition-all duration-700 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500/20 to-violet-500/20 border border-fuchsia-400/30 px-4 py-1.5 text-sm font-medium text-fuchsia-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            학부모를 위한 올인원 관리 플랫폼
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className={`mt-8 text-center text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight transition-all duration-700 delay-200 ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        <span className="block">자녀의 학습,</span>
                        <span className="block mt-2 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-violet-400 bg-clip-text text-transparent">
                            한 곳에서 관리하세요
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p
                        className={`mx-auto mt-6 max-w-xl text-center text-lg text-white/60 leading-relaxed transition-all duration-700 delay-[400ms] ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        학습플래너부터 생기부까지 — 7개 앱의 자녀 활동을 살펴보고,
                        코멘트를 남기고, 선생님과 소통하세요.
                    </p>

                    {/* CTA */}
                    <div
                        className={`mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-[600ms] ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        <Link
                            href="/"
                            className="glow-pulse inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:shadow-xl hover:shadow-fuchsia-500/30 hover:scale-[1.02]"
                            style={{ textDecoration: "none" }}
                        >
                            시작하기
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <a
                            href="#features"
                            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm px-7 py-3.5 text-base font-medium text-white/80 transition-all hover:bg-white/10 hover:border-white/25"
                            style={{ textDecoration: "none" }}
                        >
                            기능 살펴보기
                            <ChevronDown className="h-4 w-4" />
                        </a>
                    </div>

                    {/* Stats row */}
                    <div
                        className={`mt-16 flex justify-center gap-10 sm:gap-16 transition-all duration-700 delay-[800ms] ${heroLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        <StatCard number="7개" label="연동 앱" />
                        <StatCard number="실시간" label="학습 모니터링" />
                        <StatCard number="비밀" label="선생님 소통" />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FEATURE ① — 자녀 7개 앱 모니터링
                ═══════════════════════════════════════ */}
            <section
                id="features"
                className="relative overflow-hidden bg-gradient-to-b from-[#120e20] to-[#0f0a1a] text-white py-24 sm:py-32"
            >
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 right-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-screen-lg px-6">
                    {/* Section label */}
                    <div className="scroll-reveal flex items-center gap-2 text-fuchsia-400 text-sm font-bold uppercase tracking-widest mb-4">
                        <Eye className="h-4 w-4" />
                        Feature 01
                    </div>

                    <h2 className="scroll-reveal text-3xl sm:text-4xl font-extrabold leading-tight">
                        자녀의 <span className="bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent">모든 학습활동</span>을
                        <br className="hidden sm:block" /> 한눈에 확인하세요
                    </h2>

                    <p className="scroll-reveal mt-4 max-w-lg text-white/50 text-base leading-relaxed">
                        학습플래너, 생기부, 수시, 정시, 시험관리, 튜터보드, 스터디아레나.
                        7가지 앱에서 자녀가 무엇을 하고 있는지 실시간으로 살펴보고,
                        격려 코멘트를 남겨보세요.
                    </p>

                    {/* Connected Apps grid */}
                    <div className="scroll-reveal mt-10 flex flex-wrap gap-3">
                        <AppBadge name="학습플래너" icon={Clock} />
                        <AppBadge name="생기부" icon={FileText} />
                        <AppBadge name="수시" icon={GraduationCap} />
                        <AppBadge name="정시" icon={Target} />
                        <AppBadge name="시험관리" icon={BookOpen} />
                        <AppBadge name="튜터보드" icon={Users} />
                        <AppBadge name="스터디아레나" icon={Trophy} />
                    </div>

                    {/* Mock UI preview */}
                    <div className="scroll-reveal mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: Comment preview */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 float-animation">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600">
                                    <MessageCircle className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">코멘트 남기기</p>
                                    <p className="text-xs text-white/40">자녀에게 응원 메시지를 보내보세요</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 px-4 py-3">
                                    <p className="text-xs text-fuchsia-300 font-medium mb-1">엄마 → 민준이</p>
                                    <p className="text-sm text-white/80">&ldquo;수학 진도 많이 나갔네! 오늘도 화이팅 💪&rdquo;</p>
                                </div>
                                <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3">
                                    <p className="text-xs text-violet-300 font-medium mb-1">엄마 → 민준이</p>
                                    <p className="text-sm text-white/80">&ldquo;생기부 활동 정리 잘했어, 대단하다! 🎉&rdquo;</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Activity overview */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 float-animation-delay">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                                    <Bell className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">실시간 알림</p>
                                    <p className="text-xs text-white/40">자녀의 학습활동 업데이트</p>
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {[
                                    { app: "학습플래너", text: "오늘의 미션 3개 완료", time: "방금" },
                                    { app: "생기부", text: "봉사활동 기록 추가", time: "10분 전" },
                                    { app: "수시", text: "관심 대학 2곳 추가", time: "1시간 전" },
                                    { app: "정시", text: "모의지원 결과 업데이트", time: "2시간 전" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-2.5 border border-white/5"
                                    >
                                        <div>
                                            <span className="text-xs font-medium text-fuchsia-400">{item.app}</span>
                                            <p className="text-sm text-white/80">{item.text}</p>
                                        </div>
                                        <span className="text-xs text-white/30 shrink-0 ml-3">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FEATURE ② — 스터디 아레나 팀/반 구성
                ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1a] to-[#150f25] text-white py-24 sm:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-emerald-600/10 blur-[120px]" />
                    <div className="absolute top-1/3 right-0 h-[300px] w-[300px] rounded-full bg-amber-500/8 blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-screen-lg px-6">
                    <div className="scroll-reveal flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4">
                        <Swords className="h-4 w-4" />
                        Feature 02
                    </div>

                    <h2 className="scroll-reveal text-3xl sm:text-4xl font-extrabold leading-tight">
                        어머님들과 함께
                        <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">학습 아레나</span>를 만들어보세요
                    </h2>

                    <p className="scroll-reveal mt-4 max-w-lg text-white/50 text-base leading-relaxed">
                        학부모들끼리 스터디 아레나에서 팀을 구성하고,
                        자녀 학생들로 반을 만들어보세요.
                        같은 선생님의 수업을 듣거나, 학습 성과를 서로 비교하며 성장할 수 있습니다.
                    </p>

                    {/* 3-column features */}
                    <div className="scroll-reveal mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <FeatureCard
                            icon={Users}
                            title="학부모 팀 결성"
                            desc="뜻이 맞는 어머님들과 팀을 만들어 자녀들의 학습을 함께 관리하세요"
                            color="bg-gradient-to-br from-emerald-500 to-teal-600"
                        />
                        <FeatureCard
                            icon={GraduationCap}
                            title="자녀 반 구성"
                            desc="같은 팀의 자녀들로 반을 만들어 하나의 선생님에게 수업을 맡길 수 있어요"
                            color="bg-gradient-to-br from-amber-500 to-orange-600"
                        />
                        <FeatureCard
                            icon={Trophy}
                            title="학습 성과 경쟁"
                            desc="자녀들끼리 학습 성과를 비교하며 건강한 경쟁 속에서 함께 성장해요"
                            color="bg-gradient-to-br from-rose-500 to-pink-600"
                        />
                    </div>

                    {/* Arena mock illustration */}
                    <div className="scroll-reveal mt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                                <Swords className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">스터디 아레나 — 수학반</p>
                                <p className="text-xs text-white/40">김영희 선생님 · 학생 4명</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { name: "민준", score: 95, rank: 1 },
                                { name: "서연", score: 92, rank: 2 },
                                { name: "지호", score: 88, rank: 3 },
                                { name: "하은", score: 85, rank: 4 },
                            ].map((student) => (
                                <div
                                    key={student.name}
                                    className={`relative rounded-xl border p-4 text-center transition-all hover:scale-[1.03] ${student.rank === 1
                                        ? "border-amber-400/40 bg-amber-500/10"
                                        : "border-white/10 bg-white/5"
                                        }`}
                                >
                                    {student.rank === 1 && (
                                        <div className="absolute -top-2 -right-2">
                                            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                                        </div>
                                    )}
                                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500/20 to-violet-500/20 border border-fuchsia-500/30 text-sm font-bold text-fuchsia-300 mb-2">
                                        {student.rank}
                                    </div>
                                    <p className="text-sm font-bold text-white">{student.name}</p>
                                    <p className="text-xs text-white/40 mt-0.5">수학 주간 성적</p>
                                    <p className="text-lg font-extrabold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent mt-1">
                                        {student.score}점
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FEATURE ③ — 선생님 비밀 코멘트
                ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#150f25] to-[#0f0a1a] text-white py-24 sm:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-1/4 h-[300px] w-[300px] rounded-full bg-sky-600/10 blur-[100px]" />
                    <div className="absolute bottom-1/4 right-0 h-[250px] w-[250px] rounded-full bg-purple-600/8 blur-[80px]" />
                </div>

                <div className="relative mx-auto max-w-screen-lg px-6">
                    <div className="scroll-reveal flex items-center gap-2 text-sky-400 text-sm font-bold uppercase tracking-widest mb-4">
                        <MessageSquareLock className="h-4 w-4" />
                        Feature 03
                    </div>

                    <h2 className="scroll-reveal text-3xl sm:text-4xl font-extrabold leading-tight">
                        선생님과 <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">비밀 코멘트</span>를
                        <br className="hidden sm:block" /> 주고받으세요
                    </h2>

                    <p className="scroll-reveal mt-4 max-w-lg text-white/50 text-base leading-relaxed">
                        선생님에게 계정 공유를 보내면, 자녀는 볼 수 없는
                        비밀 코멘트를 선생님과 주고받을 수 있어요.
                        자녀의 학습 상담을 더 솔직하고 효과적으로 진행하세요.
                    </p>

                    <div className="scroll-reveal mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left: How it works */}
                        <div className="space-y-4">
                            {[
                                {
                                    step: "01",
                                    title: "선생님에게 계정 공유 요청",
                                    desc: "선생님의 ID를 입력하고 연결 요청을 보내세요",
                                    icon: Users,
                                    color: "from-sky-500 to-blue-600",
                                },
                                {
                                    step: "02",
                                    title: "비밀 채널 개설",
                                    desc: "선생님이 수락하면 자녀가 볼 수 없는 비밀 코멘트 채널이 생성됩니다",
                                    icon: Shield,
                                    color: "from-violet-500 to-purple-600",
                                },
                                {
                                    step: "03",
                                    title: "솔직한 상담 시작",
                                    desc: "학습 태도, 진로 고민 등 민감한 이야기를 자유롭게 나누세요",
                                    icon: MessageSquareLock,
                                    color: "from-fuchsia-500 to-pink-600",
                                },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    className="group flex gap-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 transition-all hover:bg-white/10 hover:border-white/20"
                                >
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} transition-transform group-hover:scale-110`}
                                    >
                                        <item.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xs font-bold text-white/30">STEP {item.step}</span>
                                            <h4 className="text-[15px] font-bold text-white">{item.title}</h4>
                                        </div>
                                        <p className="mt-1 text-sm text-white/50">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Chat mockup */}
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 float-animation">
                            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/10">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600">
                                    <MessageSquareLock className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white flex items-center gap-1.5">
                                        선생님 비밀 채널
                                        <Shield className="h-3.5 w-3.5 text-sky-400" />
                                    </p>
                                    <p className="text-xs text-white/40">김영희 선생님과의 대화</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Teacher message */}
                                <div className="flex gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/20 border border-sky-500/30 text-xs font-bold text-sky-300 mt-0.5">
                                        김
                                    </div>
                                    <div className="rounded-xl rounded-tl-sm bg-sky-500/10 border border-sky-500/20 px-4 py-2.5 max-w-[85%]">
                                        <p className="text-sm text-white/80">
                                            민준이가 요즘 수학에 집중력이 많이 좋아졌어요.
                                            다만 영어 단어 암기가 좀 부족한 편이라 집에서도 챙겨주시면 좋을 것 같아요 📚
                                        </p>
                                        <p className="text-[10px] text-white/25 mt-1.5">오후 3:42</p>
                                    </div>
                                </div>

                                {/* Parent message */}
                                <div className="flex gap-2 justify-end">
                                    <div className="rounded-xl rounded-tr-sm bg-fuchsia-500/15 border border-fuchsia-500/20 px-4 py-2.5 max-w-[85%]">
                                        <p className="text-sm text-white/80">
                                            감사합니다 선생님! 영어 단어 매일 30개씩 시키고 있는데,
                                            학원에서도 테스트 한번 봐주실 수 있나요? 🙏
                                        </p>
                                        <p className="text-[10px] text-white/25 mt-1.5 text-right">오후 4:15</p>
                                    </div>
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 text-xs font-bold text-fuchsia-300 mt-0.5">
                                        엄
                                    </div>
                                </div>

                                {/* Teacher reply */}
                                <div className="flex gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-500/20 border border-sky-500/30 text-xs font-bold text-sky-300 mt-0.5">
                                        김
                                    </div>
                                    <div className="rounded-xl rounded-tl-sm bg-sky-500/10 border border-sky-500/20 px-4 py-2.5 max-w-[85%]">
                                        <p className="text-sm text-white/80">
                                            물론이죠! 다음 주부터 매주 월요일에 단어 시험 보겠습니다 ✅
                                        </p>
                                        <p className="text-[10px] text-white/25 mt-1.5">오후 4:22</p>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy badge */}
                            <div className="mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-white/5 border border-white/5 py-2 text-xs text-white/30">
                                <Shield className="h-3 w-3" />
                                이 대화는 자녀에게 보이지 않습니다
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FEATURE ④ — 튜터보드 연동
                ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1a] to-[#150f25] text-white py-24 sm:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/4 left-0 h-[350px] w-[350px] rounded-full bg-indigo-600/10 blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/8 blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-screen-lg px-6">
                    <div className="scroll-reveal flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-widest mb-4">
                        <BookOpen className="h-4 w-4" />
                        Feature 04
                    </div>

                    <h2 className="scroll-reveal text-3xl sm:text-4xl font-extrabold leading-tight">
                        튜터보드와 연동하여
                        <br className="hidden sm:block" />
                        <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">수업 기록을 한눈에</span>
                    </h2>

                    <p className="scroll-reveal mt-4 max-w-lg text-white/50 text-base leading-relaxed">
                        선생님이 기록한 수업 내용, 출결, 과제, 시험 결과를
                        학부모도 실시간으로 확인할 수 있어요.
                        학습 타임라인과 성적 추이 그래프로 자녀의 성장을 추적하세요.
                    </p>

                    {/* 4-grid feature cards */}
                    <div className="scroll-reveal mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FeatureCard
                            icon={Eye}
                            title="대시보드"
                            desc="자녀별 수업 현황, 오늘 출결, 미제출 과제를 카드 형태로 한눈에 확인"
                            color="bg-gradient-to-br from-indigo-500 to-blue-600"
                        />
                        <FeatureCard
                            icon={Clock}
                            title="학습 타임라인"
                            desc="수업 · 시험 · 과제를 시간순으로 통합 표시, 타입별 아이콘과 필터 제공"
                            color="bg-gradient-to-br from-cyan-500 to-teal-600"
                        />
                        <FeatureCard
                            icon={Target}
                            title="성적 추이"
                            desc="과목별 꺾은선 그래프로 성적 변화를 추적, 평균 · 최고 · 최저 표시"
                            color="bg-gradient-to-br from-violet-500 to-purple-600"
                        />
                        <FeatureCard
                            icon={BookOpen}
                            title="수업 기록 열람"
                            desc="날짜별 출결, 수업 내용, 과제 결과, 테스트 점수를 테이블로 조회"
                            color="bg-gradient-to-br from-pink-500 to-rose-600"
                        />
                    </div>

                    {/* Mock dashboard preview */}
                    <div className="scroll-reveal mt-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-600">
                                <Eye className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">학부모 대시보드</p>
                                <p className="text-xs text-white/40">자녀 현황 요약</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {[
                                { label: "등록 자녀", value: "2명", color: "from-indigo-500/20 to-blue-500/20", border: "border-indigo-500/30" },
                                { label: "미제출 과제", value: "3건", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30" },
                                { label: "총 수업", value: "5개", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/30" },
                            ].map((stat) => (
                                <div
                                    key={stat.label}
                                    className={`rounded-xl bg-gradient-to-br ${stat.color} border ${stat.border} p-4 text-center`}
                                >
                                    <p className="text-xs text-white/50">{stat.label}</p>
                                    <p className="text-2xl font-extrabold text-white mt-1">{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Mock child cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    name: "민준",
                                    classes: ["수학 A반", "영어 기초"],
                                    attendance: "출석",
                                    pending: 1,
                                },
                                {
                                    name: "서연",
                                    classes: ["수학 B반", "국어 심화", "과학 실험"],
                                    attendance: "출석",
                                    pending: 2,
                                },
                            ].map((child) => (
                                <div
                                    key={child.name}
                                    className="rounded-xl border border-white/10 bg-white/5 p-4"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 text-xs font-bold text-indigo-300">
                                                {child.name[0]}
                                            </div>
                                            <span className="text-sm font-bold text-white">{child.name}</span>
                                        </div>
                                        {child.pending > 0 && (
                                            <span className="text-[10px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                                미제출 {child.pending}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        {child.classes.map((cls) => (
                                            <div
                                                key={cls}
                                                className="flex items-center justify-between text-xs px-2 py-1.5 rounded-lg bg-white/5"
                                            >
                                                <span className="text-white/70">{cls}</span>
                                                <span className="text-emerald-400 text-[10px]">✓ {child.attendance}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mock chart preview */}
                        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Target className="h-4 w-4 text-violet-400" />
                                <p className="text-sm font-bold text-white">성적 추이</p>
                                <span className="text-xs text-white/30 ml-auto">민준 · 수학 A반</span>
                            </div>
                            {/* Fake chart using bars */}
                            <div className="flex items-end gap-2 h-24">
                                {[68, 72, 75, 70, 82, 88, 85, 92].map((score, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[9px] text-white/30">{score}</span>
                                        <div
                                            className="w-full rounded-t-md bg-gradient-to-t from-indigo-500/60 to-cyan-400/60 transition-all"
                                            style={{ height: `${score * 0.8}%` }}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-[9px] text-white/20 mt-1 px-1">
                                <span>3월</span>
                                <span>4월</span>
                                <span>5월</span>
                                <span>6월</span>
                                <span>7월</span>
                                <span>8월</span>
                                <span>9월</span>
                                <span>10월</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FINAL CTA
                ═══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#0f0a1a] to-[#1a1035] text-white py-24 sm:py-32">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-fuchsia-600/10 blur-[150px]" />
                </div>

                <div className="relative mx-auto max-w-screen-sm px-6 text-center">
                    <div className="scroll-reveal">
                        <Sparkles className="mx-auto h-8 w-8 text-fuchsia-400 mb-6" />
                        <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                            자녀의 학습 파트너가
                            <br />
                            <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">
                                되어주세요
                            </span>
                        </h2>
                        <p className="mt-4 text-white/50 text-base leading-relaxed">
                            학부모 어드민으로 자녀의 학습을 함께 관리하고,
                            선생님과 긴밀히 소통하며, 최고의 학습 환경을 만들어보세요.
                        </p>

                        <Link
                            href="/"
                            className="glow-pulse mt-10 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-fuchsia-500/25 transition-all hover:shadow-xl hover:shadow-fuchsia-500/30 hover:scale-[1.02]"
                            style={{ textDecoration: "none" }}
                        >
                            지금 시작하기
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                FOOTER
                ═══════════════════════════════════════ */}
            <Footer />
        </>
    );
}
