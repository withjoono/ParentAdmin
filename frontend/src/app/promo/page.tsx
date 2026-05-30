import {
  ArrowRight,
  Eye,
  Bell,
  Users,
  MessageSquareLock,
  BookOpen,
  Calendar,
  Network,
  Sparkles,
  Heart,
  Shield,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "학부모앱 — 자녀 학습 통합 모니터링",
  description: "자녀의 7개 앱 학습 활동을 한 곳에서. 격려 코멘트와 선생님 비밀 채널로 함께하는 학습 파트너.",
};

const VALUE_PROPS = [
  {
    icon: Eye,
    title: "7개 앱, 한 화면",
    body:
      "학습플래너 · 생기부 · 수시 · 정시 · 시험관리 · 튜터보드 · 스터디아레나. 자녀가 어디서 무엇을 하는지 한 화면에서 확인합니다.",
  },
  {
    icon: Heart,
    title: "격려는 한 번의 코멘트로",
    body:
      "자녀의 학습 기록 어디에서나 곧바로 응원 메시지를 남길 수 있어요. 자녀앱에 즉시 알림이 닿습니다.",
  },
  {
    icon: Shield,
    title: "선생님과 비밀 채널",
    body:
      "자녀가 볼 수 없는 비밀 대화로 선생님과 솔직한 학습 상담이 가능합니다. 민감한 진로 이야기도 안심하고 나누세요.",
  },
];

const FEATURES = [
  { icon: Eye, title: "통합 모니터링", body: "자녀의 7개 앱 활동을 한 화면에서 실시간 확인" },
  { icon: Bell, title: "실시간 알림", body: "미션 완료·과제 제출·시험 결과를 즉시 알림" },
  { icon: Users, title: "학부모 팀", body: "어머님들과 팀을 결성하고 자녀들로 반 구성" },
  { icon: MessageSquareLock, title: "선생님 비밀 채널", body: "자녀가 보지 못하는 비밀 코멘트로 솔직한 상담" },
  { icon: BookOpen, title: "수업 기록", body: "출결·과제·시험 결과를 타임라인으로 통합 조회" },
  { icon: Calendar, title: "통합 일정", body: "시간표·학원·NEIS 급식까지 한 캘린더에" },
];

const ECOSYSTEM = [
  { name: "Hub", desc: "인증 · 자녀 계정 연동" },
  { name: "StudyPlanner", desc: "자녀 학습 플래너 모니터링" },
  { name: "Saenggi-Book", desc: "자녀 생기부 활동 열람" },
  { name: "ExamHub", desc: "자녀 시험 결과 · 분석" },
  { name: "TutorBoard", desc: "수업 기록 · 출결 · 성적" },
];

const READY = [
  "자녀 계정 연동 (Hub 1회 인증)",
  "7개 앱 활동 통합 대시보드",
  "자녀에게 격려 코멘트 남기기",
  "실시간 학습 활동 알림",
  "선생님 비밀 채널 개설",
  "수업 기록·출결·과제 조회",
  "성적 추이 그래프",
  "통합 일정 캘린더 (NEIS 급식 포함)",
  "스터디 아레나 팀·반 구성",
];

export default function PromoPage() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-background to-background">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-12 sm:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            거북스쿨 생태계 · 학부모 전용
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            자녀의 학습을 <span className="text-primary">한 곳에서</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            자녀의 7개 앱 학습 활동을 한 곳에서 — 학부모용 통합 모니터링. 격려 코멘트를 남기고, 선생님과 솔직한 비밀 채널로 상담하세요.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            >
              시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://www.tskool.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border bg-background px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
            >
              Hub에서 가입
            </a>
          </div>
        </div>
      </section>

      {/* ===== VALUE PROPS ===== */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-12">
        <div className="grid gap-5 md:grid-cols-3">
          {VALUE_PROPS.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="rounded-2xl border bg-card p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== FEATURE GRID ===== */}
      <section className="bg-secondary/30 px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              무엇이 들어 있나
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              모니터링부터 선생님 상담까지 — 학부모가 매일 쓰는 도구가 한 화면에 모여 있습니다.
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ECOSYSTEM ===== */}
      <section className="mx-auto max-w-5xl px-6 py-20 sm:px-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            자녀 한 명이 5개 앱을 따로 쓰지 않습니다
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            거북스쿨의 앱들이 한 계정으로 묶여 있어, 학부모는 본 앱 하나만 열면 자녀의 모든 활동이 한 화면에 모입니다.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wide opacity-80">중심</p>
            <p className="mt-2 text-lg font-bold">학부모앱</p>
            <p className="mt-1 text-xs opacity-80">모니터링 · 격려 · 상담</p>
          </div>
          {ECOSYSTEM.map((e) => (
            <div key={e.name} className="rounded-2xl border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">앱</p>
              <p className="mt-2 text-lg font-bold text-foreground">{e.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== READY ===== */}
      <section className="bg-secondary/30 px-6 py-20 sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            지금 바로 가능한 것
          </h2>
          <p className="mt-4 text-muted-foreground">아래 모든 기능이 작동 중입니다.</p>
        </div>
        <ul className="mx-auto mt-10 grid max-w-3xl gap-2 sm:grid-cols-2">
          {READY.map((r) => (
            <li
              key={r}
              className="flex items-center gap-2 rounded-xl border bg-card px-4 py-3 text-sm text-foreground"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:px-12">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Trophy className="h-6 w-6" />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          자녀의 학습 파트너가 되어주세요
        </h2>
        <p className="mt-4 text-muted-foreground">
          Hub 계정으로 로그인하고 자녀 계정을 연결하면 7개 앱의 활동이 한 화면에 모입니다. 첫 코멘트는 1분 안에 남길 수 있어요.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
