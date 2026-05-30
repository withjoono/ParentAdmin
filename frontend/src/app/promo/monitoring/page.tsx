import {
  Eye,
  Clock,
  FileText,
  GraduationCap,
  Target,
  BookOpen,
  Users,
  Trophy,
  Heart,
} from "lucide-react";
import {
  PromoHero,
  PromoSection,
  FeatureGrid,
  StepList,
  CheckList,
  FinalCTA,
} from "../_components";

export const metadata = {
  title: "통합 모니터링 — 학부모앱",
  description: "자녀의 7개 앱 학습 활동을 한 곳에서. 어디서 무엇을 하는지 한눈에 확인하세요.",
};

export default function PromoMonitoringPage() {
  return (
    <main>
      <PromoHero
        badge="통합 모니터링"
        Icon={Eye}
        title="7개 앱을"
        highlight="한 화면에"
        body="학습플래너 · 생기부 · 수시 · 정시 · 시험관리 · 튜터보드 · 스터디아레나. 자녀가 어디서 무엇을 하고 있는지 한 곳에서 살펴보고, 그 자리에서 응원 코멘트를 남기세요."
        primaryHref="/"
        primaryLabel="자녀 활동 보기"
        secondaryHref="/promo"
        secondaryLabel="전체 기능 보기"
      />

      <PromoSection
        title="자녀의 모든 학습활동, 한눈에"
        subtitle="7개 위성앱이 한 계정·한 데이터로 묶여 있어 학부모는 본 앱 하나만 열면 됩니다."
      >
        <FeatureGrid
          items={[
            { icon: Clock, title: "학습플래너", body: "오늘의 미션·계획·실행률을 실시간 확인" },
            { icon: FileText, title: "생기부", body: "교내활동·봉사·독서 기록을 한 화면에" },
            { icon: GraduationCap, title: "수시", body: "관심 대학·전형 분석·합격 가능성 추적" },
            { icon: Target, title: "정시", body: "모의지원 결과·표준점수 추이 모니터링" },
            { icon: BookOpen, title: "시험관리", body: "응시 시험·오답노트·약점 분석 열람" },
            { icon: Users, title: "튜터보드", body: "학원 수업 출결·과제 제출률·코멘트" },
            { icon: Trophy, title: "스터디아레나", body: "또래 학생들과의 학습량 비교·랭킹" },
            { icon: Heart, title: "그 자리에서 격려", body: "어떤 활동 카드에서도 코멘트 즉시 전송" },
          ]}
        />
      </PromoSection>

      <PromoSection title="3단계로 자녀 모니터링 시작" tone="muted">
        <div className="mx-auto max-w-3xl">
          <StepList
            steps={[
              {
                title: "Hub 계정으로 로그인",
                body: "거북스쿨 한 계정으로 모든 위성앱 데이터가 자동 연결됩니다.",
              },
              {
                title: "자녀 계정 연동",
                body: "자녀의 거북스쿨 ID로 연결 요청 → 자녀 승인 → 즉시 모니터링 시작.",
              },
              {
                title: "통합 대시보드 확인",
                body: "메인 화면에서 7개 앱의 자녀 활동이 카드별로 정렬되어 표시됩니다.",
              },
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection title="지금 바로 가능한 것">
        <div className="mx-auto max-w-3xl">
          <CheckList
            items={[
              "7개 앱 활동 통합 카드 뷰",
              "자녀별 학습 현황 요약",
              "활동별 즉시 격려 코멘트",
              "오늘·이번주·이번달 필터",
              "여러 자녀 동시 등록·전환",
              "활동 타입별 검색·필터",
              "최근 활동 타임라인",
              "자녀 활동에 좋아요·이모지",
            ]}
          />
        </div>
      </PromoSection>

      <FinalCTA
        Icon={Eye}
        title="자녀의 학습이 한 화면에 보입니다"
        body="Hub 계정으로 로그인하고 자녀 ID를 연결하세요. 7개 앱의 모든 활동이 즉시 통합됩니다."
        primaryHref="/"
        primaryLabel="모니터링 시작하기"
      />
    </main>
  );
}
