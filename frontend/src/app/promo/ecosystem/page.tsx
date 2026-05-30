import {
  Network,
  Link2,
  Shield,
  Users,
  GraduationCap,
  FileText,
  BookOpen,
  Trophy,
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
  title: "거북스쿨 생태계 연동 — 학부모앱",
  description: "한 번의 Hub 로그인으로 7개 위성앱의 자녀 데이터가 한 화면에 모입니다.",
};

export default function PromoEcosystemPage() {
  return (
    <main>
      <PromoHero
        badge="생태계 연동"
        Icon={Network}
        title="한 번 연동,"
        highlight="7개 앱이 따라옵니다"
        body="자녀가 Hub에서 학부모와 한 번 계정 연동을 승인하면, 7개 위성앱의 모든 학습 데이터가 학부모앱 한 화면에 자동으로 모입니다."
        primaryHref="/"
        primaryLabel="자녀 연동하기"
        secondaryHref="https://www.tskool.kr"
        secondaryLabel="거북스쿨 알아보기"
      />

      <PromoSection
        title="한 계정·한 데이터·한 화면"
        subtitle="자녀가 7개 앱을 따로 쓰지 않듯, 학부모도 7개 화면을 따로 열지 않습니다."
      >
        <FeatureGrid
          items={[
            { icon: Link2, title: "Hub SSO", body: "거북스쿨 한 계정으로 모든 위성앱 인증 자동 처리" },
            { icon: Shield, title: "권한 격리", body: "학부모는 자녀의 '학부모용 권한'만 — 글쓰기·수정 제한" },
            { icon: Users, title: "다중 자녀 지원", body: "여러 자녀를 한 학부모 계정에 등록·전환 가능" },
            { icon: GraduationCap, title: "학습플래너 연동", body: "자녀 플래너 미션·실행률 실시간 반영" },
            { icon: FileText, title: "생기부 연동", body: "자녀 교내활동·봉사·독서 기록 열람" },
            { icon: BookOpen, title: "ExamHub 연동", body: "자녀 시험 결과·오답·약점 분석" },
            { icon: Users, title: "튜터보드 연동", body: "학원 출결·과제·코멘트 실시간" },
            { icon: Trophy, title: "스터디아레나 연동", body: "또래 학생들과 학습량 비교" },
          ]}
        />
      </PromoSection>

      <PromoSection title="3단계로 생태계 연동" tone="muted">
        <div className="mx-auto max-w-3xl">
          <StepList
            steps={[
              {
                title: "학부모 Hub 가입",
                body: "tskool.kr에서 학부모 계정으로 가입. 본인 인증 1회.",
              },
              {
                title: "자녀 연동 요청",
                body: "자녀의 거북스쿨 ID로 연동 요청 → 자녀가 자기 앱에서 승인.",
              },
              {
                title: "7개 앱 데이터 자동 흐름",
                body: "승인 즉시 학습플래너·생기부·수시·정시·시험관리·튜터보드·스터디아레나의 자녀 데이터가 학부모앱에 모입니다.",
              },
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection title="지금 바로 가능한 것">
        <div className="mx-auto max-w-3xl">
          <CheckList
            items={[
              "Hub SSO 단일 로그인",
              "여러 자녀 동시 연동",
              "7개 위성앱 데이터 통합",
              "자녀별 권한 분리",
              "학부모 보기 전용 모드",
              "연동 해제·재연동 자유",
              "자녀 승인 이력 조회",
              "위성앱 추가 시 자동 합류",
            ]}
          />
        </div>
      </PromoSection>

      <FinalCTA
        Icon={Network}
        title="한 번 연동, 평생 함께"
        body="Hub 계정 한 번이면 자녀가 어떤 위성앱을 쓰든 학부모앱이 따라옵니다. 앞으로 추가될 앱도 자동으로."
        primaryHref="/"
        primaryLabel="자녀 연동 시작"
      />
    </main>
  );
}
