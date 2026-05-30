import {
  Calendar,
  CalendarDays,
  Utensils,
  Clock,
  School,
  Bell,
  Repeat,
  CalendarCheck,
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
  title: "통합 일정 캘린더 — 학부모앱",
  description: "자녀의 학교 시간표·학원 일정·NEIS 급식까지 한 캘린더로. 매일 챙길 것이 한 화면에.",
};

export default function PromoSchedulePage() {
  return (
    <main>
      <PromoHero
        badge="통합 일정"
        Icon={CalendarDays}
        title="시간표·학원·급식을"
        highlight="한 캘린더에"
        body="자녀의 학교 시간표, 학원 수업, 시험·과제 마감일, 그리고 NEIS 급식 메뉴까지 — 매일 챙길 모든 것이 한 캘린더에 모입니다."
        primaryHref="/"
        primaryLabel="캘린더 보기"
        secondaryHref="/promo"
        secondaryLabel="전체 기능 보기"
      />

      <PromoSection
        title="자녀의 하루를 한 화면에"
        subtitle="여러 캘린더 앱 사이를 돌아다닐 필요가 없습니다."
      >
        <FeatureGrid
          items={[
            { icon: School, title: "학교 시간표", body: "자녀 학교·반의 시간표를 자동 동기화" },
            { icon: Utensils, title: "NEIS 급식", body: "오늘·이번 주 급식 메뉴를 자동 표시" },
            { icon: Clock, title: "학원 수업", body: "튜터보드 등록 수업이 캘린더에 자동 표식" },
            { icon: CalendarCheck, title: "시험·과제 마감", body: "선생님이 발행한 시험·과제 일정 자동 동기화" },
            { icon: Bell, title: "사전 알림", body: "1시간 전·1일 전·1주 전 푸시 알림 설정" },
            { icon: Repeat, title: "반복 일정", body: "주간 학원·정기 모임 등 반복 설정 가능" },
          ]}
        />
      </PromoSection>

      <PromoSection title="3단계로 캘린더 시작" tone="muted">
        <div className="mx-auto max-w-3xl">
          <StepList
            steps={[
              {
                title: "자녀 학교·학원 등록",
                body: "자녀의 학교 코드·학년·반을 입력하면 NEIS 시간표·급식이 자동으로 들어옵니다.",
              },
              {
                title: "튜터보드 학원 연결",
                body: "자녀가 다니는 학원이 튜터보드에 있으면 학원 수업이 캘린더에 자동 추가.",
              },
              {
                title: "맞춤 일정 추가",
                body: "병원·외부 모임·가족 약속 등을 직접 추가하면 같은 캘린더에 통합 표시.",
              },
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection title="지금 바로 가능한 것">
        <div className="mx-auto max-w-3xl">
          <CheckList
            items={[
              "NEIS 시간표·급식 자동 동기화",
              "학원 수업 자동 표식",
              "시험·과제 마감일 통합",
              "사전 알림(1시간·1일·1주)",
              "반복 일정 설정",
              "여러 자녀 캘린더 색상 분리",
              "주·월·일별 뷰 전환",
              "ICS 외부 캘린더 내보내기",
            ]}
          />
        </div>
      </PromoSection>

      <FinalCTA
        Icon={Calendar}
        title="자녀의 하루를 미리 챙기세요"
        body="자녀 학교 정보만 입력하면 시간표·급식이 자동으로 들어옵니다. 첫 캘린더는 30초면 완성."
        primaryHref="/"
        primaryLabel="캘린더 열기"
      />
    </main>
  );
}
