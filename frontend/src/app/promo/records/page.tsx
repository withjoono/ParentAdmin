import {
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Calendar,
  FileText,
  CheckSquare,
  BarChart3,
  ListChecks,
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
  title: "수업 기록 통합 조회 — 학부모앱",
  description: "출결·과제·시험 결과·코멘트를 학원별로 분리해 한 화면에서 조회하세요.",
};

export default function PromoRecordsPage() {
  return (
    <main>
      <PromoHero
        badge="수업 기록"
        Icon={BookOpen}
        title="자녀의 수업을"
        highlight="한 타임라인에"
        body="선생님이 튜터보드에 기록한 출결·수업 내용·과제 결과·시험 점수가 학부모앱에 실시간 반영됩니다. 학원·과목·날짜별로 자유롭게 필터링하세요."
        primaryHref="/"
        primaryLabel="수업 기록 보기"
        secondaryHref="/promo"
        secondaryLabel="전체 기능 보기"
      />

      <PromoSection
        title="선생님 기록 = 학부모 화면"
        subtitle="선생님이 한 번 입력하면 학부모는 그 자리에서 봅니다. 추가 행동 0회."
      >
        <FeatureGrid
          items={[
            { icon: CheckSquare, title: "출결 기록", body: "출석·지각·결석·조퇴를 날짜·학원별로 통합" },
            { icon: FileText, title: "수업 내용", body: "선생님이 적은 수업 진도·다음 시간 안내를 그대로 열람" },
            { icon: ClipboardCheck, title: "과제 현황", body: "과제별 제출·미제출·채점 결과를 한 카드에" },
            { icon: BarChart3, title: "시험 점수", body: "학원 자체 시험·테스트 결과를 과목별 추이로" },
            { icon: TrendingUp, title: "성적 추이", body: "꺾은선 그래프로 과목별·학원별 변화 추적" },
            { icon: ListChecks, title: "학원별 분리", body: "여러 학원·여러 선생님 기록을 보기 좋게 분리" },
          ]}
        />
      </PromoSection>

      <PromoSection title="3단계로 수업 기록 조회" tone="muted">
        <div className="mx-auto max-w-3xl">
          <StepList
            steps={[
              {
                title: "튜터보드 연동 확인",
                body: "자녀가 학원의 튜터보드에 등록되어 있는지 확인. 같은 거북스쿨 계정이면 자동 연결.",
              },
              {
                title: "학원·과목 필터 선택",
                body: "메인 메뉴 '수업 기록' → 학원·과목·기간을 선택하면 타임라인이 갱신됩니다.",
              },
              {
                title: "상세 카드에서 코멘트",
                body: "특정 기록에서 곧바로 자녀에게 격려 코멘트, 또는 선생님께 비밀 채널 질문 가능.",
              },
            ]}
          />
        </div>
      </PromoSection>

      <PromoSection title="지금 바로 가능한 것">
        <div className="mx-auto max-w-3xl">
          <CheckList
            items={[
              "출결·과제·시험 통합 타임라인",
              "학원·과목·기간 다중 필터",
              "성적 추이 꺾은선 그래프",
              "과목 평균·최고·최저 비교",
              "수업 노트·진도표 열람",
              "기록 카드에서 코멘트 즉시",
              "엑셀·PDF 내보내기",
              "여러 자녀 기록 동시 비교",
            ]}
          />
        </div>
      </PromoSection>

      <FinalCTA
        Icon={BookOpen}
        title="자녀의 수업을 놓치지 마세요"
        body="튜터보드와 연동된 학원이면 추가 설정 없이 모든 기록이 자동 흐릅니다. 지금 바로 확인해보세요."
        primaryHref="/"
        primaryLabel="수업 기록 열어보기"
      />
    </main>
  );
}
