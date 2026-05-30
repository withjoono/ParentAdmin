import {
  Users,
  Trophy,
  GraduationCap,
  Hash,
  UserPlus,
  Crown,
  Swords,
  Sparkles,
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
  title: "학부모 팀·반 구성 — 학부모앱",
  description: "어머님들과 함께 스터디 팀을 만들고, 자녀들로 반을 구성해 한 선생님께 맡기세요.",
};

export default function PromoTeamPage() {
  return (
    <main>
      <PromoHero
        badge="학부모 팀·반 구성"
        Icon={Users}
        title="어머님들과 함께"
        highlight="학습 아레나"
        body="뜻이 맞는 학부모들과 팀을 결성하고, 자녀들로 반을 만들어 같은 선생님께 맡기거나 자녀들끼리 학습 성과를 비교할 수 있습니다. 함께 키우는 학습 공동체."
        primaryHref="/"
        primaryLabel="팀 만들기"
        secondaryHref="/promo"
        secondaryLabel="전체 기능 보기"
      />

      <PromoSection
        title="혼자 키우지 않습니다 — 함께 키웁니다"
        subtitle="같은 학년·같은 학원·같은 목표 — 무엇이든 묶여서 팀이 됩니다."
      >
        <FeatureGrid
          items={[
            { icon: Users, title: "학부모 팀 결성", body: "초대 코드로 어머님들과 비공개 팀 구성" },
            { icon: GraduationCap, title: "자녀 반 구성", body: "팀 자녀들로 반을 만들고 한 선생님께 일괄 맡기기" },
            { icon: Trophy, title: "스터디 아레나 연동", body: "자녀들 학습 성과를 같은 보드에서 비교" },
            { icon: Crown, title: "팀장·반장 권한", body: "팀장이 선생님 섭외·반 운영 정책 결정" },
            { icon: Hash, title: "초대 코드", body: "6자리 코드로 다른 학부모 간편 초대" },
            { icon: Swords, title: "건강한 경쟁", body: "주간·월간 학습량 랭킹으로 동기 부여" },
          ]}
        />
      </PromoSection>

      <PromoSection title="3단계로 팀 시작" tone="muted">
        <div className="mx-auto max-w-3xl">
          <StepList
            steps={[
              {
                title: "팀 만들기",
                body: "메인 메뉴 '학부모 팀' → '+ 새 팀'. 팀 이름·학년·과목만 입력하면 끝.",
              },
              {
                title: "어머님들 초대",
                body: "6자리 초대 코드를 카톡으로 공유하거나, 학부모 ID로 직접 초대.",
              },
              {
                title: "반 구성·선생님 섭외",
                body: "팀 자녀들로 반을 만들고 선생님 ID로 수업 의뢰. 학생·선생님·학부모가 자동 연결됩니다.",
              },
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection title="지금 바로 가능한 것">
        <div className="mx-auto max-w-3xl">
          <CheckList
            items={[
              "팀 생성·초대·해체",
              "초대 코드 발급/회수",
              "팀 자녀들로 반 구성",
              "선생님 ID 검색·섭외",
              "팀 내 비공개 채팅",
              "주간 학습량 랭킹 보드",
              "팀장 권한 위임·이전",
              "여러 팀 동시 참여",
            ]}
          />
        </div>
      </PromoSection>

      <FinalCTA
        Icon={Sparkles}
        title="혼자가 아닌 함께 키우는 학습"
        body="어머님들과 팀을 만들고 자녀들의 학습을 함께 관리하세요. 첫 팀 생성은 1분이면 됩니다."
        primaryHref="/"
        primaryLabel="팀 만들기 시작"
      />
    </main>
  );
}
