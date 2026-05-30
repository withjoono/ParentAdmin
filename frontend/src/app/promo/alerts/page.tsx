import {
  Bell,
  BellRing,
  Smartphone,
  CheckCircle,
  Clock,
  AlertCircle,
  Sparkles,
  Send,
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
  title: "실시간 알림 — 학부모앱",
  description: "자녀의 학습 활동을 실시간으로. 미션 완료·과제 제출·시험 결과를 즉시 알림으로 받으세요.",
};

export default function PromoAlertsPage() {
  return (
    <main>
      <PromoHero
        badge="실시간 알림"
        Icon={BellRing}
        title="자녀의 한 걸음을"
        highlight="즉시"
        body="오늘 미션 완료, 봉사활동 추가, 모의지원 업데이트, 시험 응시 — 자녀의 모든 학습 변화를 실시간 알림으로 받아보세요. 격려 메시지로 곧바로 응답할 수 있습니다."
        primaryHref="/"
        primaryLabel="알림 설정하기"
        secondaryHref="/promo"
        secondaryLabel="전체 기능 보기"
      />

      <PromoSection
        title="놓치지 않을 알림, 부담은 적게"
        subtitle="중요한 변화만 푸시로, 일상적인 활동은 인앱 알림으로. 자녀의 흐름을 끊지 않습니다."
      >
        <FeatureGrid
          items={[
            { icon: CheckCircle, title: "미션 완료 알림", body: "자녀가 오늘의 미션을 끝낸 순간 즉시 알림" },
            { icon: AlertCircle, title: "미제출 경고", body: "과제 마감 24시간 전 자동 푸시" },
            { icon: Sparkles, title: "성과 알림", body: "시험 결과·성적 추이 갱신 시 강조 알림" },
            { icon: Clock, title: "타임라인 모드", body: "하루 활동을 시간순 한 줄로 요약" },
            { icon: Send, title: "즉시 응답", body: "알림 카드에서 곧바로 격려 코멘트 전송" },
            { icon: Smartphone, title: "다중 디바이스", body: "PC·모바일 어디서나 동기화된 알림" },
          ]}
        />
      </PromoSection>

      <PromoSection title="3단계로 알림 켜기" tone="muted">
        <div className="mx-auto max-w-3xl">
          <StepList
            steps={[
              {
                title: "자녀 연동",
                body: "Hub에서 자녀 계정을 연결하면 7개 앱의 활동이 알림 대상으로 자동 등록됩니다.",
              },
              {
                title: "알림 우선순위 선택",
                body: "어떤 앱·어떤 활동 종류를 푸시로 받을지 자녀별·과목별로 토글하세요.",
              },
              {
                title: "실시간 수신 시작",
                body: "활동 발생 → 알림 도착 → 알림 카드에서 곧바로 코멘트로 응답.",
              },
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection title="지금 바로 가능한 것">
        <div className="mx-auto max-w-3xl">
          <CheckList
            items={[
              "활동별 실시간 푸시 알림",
              "자녀별 알림 우선순위 설정",
              "앱별 알림 ON/OFF 토글",
              "방해금지 시간대 지정",
              "알림 히스토리 검색",
              "알림에서 즉시 코멘트 회신",
              "주간 요약 리포트",
              "중요 알림만 모아보기",
            ]}
          />
        </div>
      </PromoSection>

      <FinalCTA
        Icon={BellRing}
        title="자녀의 한 걸음마다 함께하세요"
        body="알림 설정은 1분이면 끝. 자녀가 미션을 완료하는 순간 알림을 받고 곧바로 응원할 수 있어요."
        primaryHref="/"
        primaryLabel="알림 설정 시작하기"
      />
    </main>
  );
}
