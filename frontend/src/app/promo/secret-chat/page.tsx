import {
  MessageSquareLock,
  Shield,
  Users,
  Lock,
  EyeOff,
  Send,
  KeyRound,
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
  title: "선생님 비밀 채널 — 학부모앱",
  description: "자녀에게는 보이지 않는 비밀 채널로 선생님과 솔직한 상담. 계정 공유로 안전하게 연결.",
};

export default function PromoSecretChatPage() {
  return (
    <main>
      <PromoHero
        badge="선생님 비밀 채널"
        Icon={MessageSquareLock}
        title="선생님과의"
        highlight="비밀 대화"
        body="선생님에게 계정 공유를 요청하면 자녀가 볼 수 없는 비밀 채널이 열립니다. 학습 태도·진로 고민·민감한 상담을 안심하고 나누세요."
        primaryHref="/"
        primaryLabel="선생님 연결하기"
        secondaryHref="/promo"
        secondaryLabel="전체 기능 보기"
      />

      <PromoSection
        title="솔직한 대화가 더 좋은 결과를 만듭니다"
        subtitle="자녀 앞에서 못 하는 이야기, 선생님과만 나누는 비공개 채널."
      >
        <FeatureGrid
          items={[
            { icon: Lock, title: "자녀 비공개", body: "이 채널의 메시지는 자녀 계정에서 절대 보이지 않습니다" },
            { icon: KeyRound, title: "계정 공유 인증", body: "선생님 ID 인증 → 양쪽 수락 → 비밀 채널 자동 개설" },
            { icon: Shield, title: "암호화 저장", body: "DB에서도 일반 코멘트와 분리·암호화되어 격리 저장" },
            { icon: Send, title: "실시간 전송", body: "선생님이 모바일로 응답 → 학부모 푸시 즉시 도착" },
            { icon: Heart, title: "진솔한 상담", body: "성격·교우관계·진로 고민 등 민감한 주제도 자유롭게" },
            { icon: EyeOff, title: "자녀 비밀 보호", body: "자녀의 자존감을 지키며 선생님과 1:1 소통" },
          ]}
        />
      </PromoSection>

      <PromoSection title="3단계로 비밀 채널 개설" tone="muted">
        <div className="mx-auto max-w-3xl">
          <StepList
            steps={[
              {
                title: "선생님에게 계정 공유 요청",
                body: "튜터보드에서 자녀를 가르치는 선생님의 ID를 검색하고 비밀 채널 요청을 보내세요.",
              },
              {
                title: "선생님 수락",
                body: "선생님이 선생님앱에서 요청을 수락하면, 학부모 ↔ 선생님 전용 채널이 생성됩니다.",
              },
              {
                title: "솔직한 상담 시작",
                body: "학습 태도·진로·심리·교우관계 등 자녀가 보지 못할 이야기를 자유롭게 나누세요.",
              },
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection title="지금 바로 가능한 것">
        <div className="mx-auto max-w-3xl">
          <CheckList
            items={[
              "선생님 ID 검색·연결 요청",
              "자녀별 비밀 채널 분리",
              "메시지·파일·이미지 송수신",
              "읽음 표시·실시간 알림",
              "채널 비밀번호 보호",
              "선생님 응답 푸시 알림",
              "대화 검색·핀 고정",
              "여러 선생님 동시 채널",
            ]}
          />
        </div>
      </PromoSection>

      <FinalCTA
        Icon={MessageSquareLock}
        title="자녀의 자존감을 지키며 솔직하게"
        body="비밀 채널은 자녀에게 절대 노출되지 않습니다. 첫 선생님 연결까지 1분이면 충분합니다."
        primaryHref="/"
        primaryLabel="비밀 채널 시작하기"
      />
    </main>
  );
}
