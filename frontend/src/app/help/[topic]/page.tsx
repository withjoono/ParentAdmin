import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Section {
    heading: string;
    body: string[];
}

const TOPICS: Record<
    string,
    {
        title: string;
        subtitle: string;
        sections: Section[];
    }
> = {
    start: {
        title: "시작하기",
        subtitle: "처음 가입부터 자녀 연동까지",
        sections: [
            {
                heading: "1. 거북스쿨 계정 만들기",
                body: [
                    "학부모앱은 tskool.kr 계정 하나로 모든 거북스쿨 서비스에 로그인합니다.",
                    "tskool.kr → 회원가입에서 학부모 역할로 가입해 주세요.",
                ],
            },
            {
                heading: "2. 학부모앱 접속",
                body: [
                    "parent-admin-front.web.app에 접속하면 자동으로 tskool 로그인 화면으로 이동합니다.",
                    "로그인 후 자동으로 학부모앱 대시보드로 돌아옵니다.",
                ],
            },
            {
                heading: "3. 자녀 연동",
                body: [
                    "대시보드에 자녀가 없으면 '자녀와 계정 연동' 안내가 표시됩니다.",
                    "버튼을 누르면 Hub의 계정연동 화면이 새 탭으로 열립니다.",
                    "자녀의 거북스쿨 ID 또는 이메일로 연결한 뒤 학부모앱 탭으로 돌아오면 자동 반영됩니다.",
                ],
            },
        ],
    },
    dashboard: {
        title: "대시보드",
        subtitle: "위젯과 캘린더의 의미",
        sections: [
            {
                heading: "요약 카드 3개",
                body: [
                    "등록 자녀: 연동 완료된 자녀 수.",
                    "미제출 과제: 모든 자녀의 미제출 과제 합계.",
                    "평균 진도율: 자녀별 수업 진도의 평균.",
                ],
            },
            {
                heading: "통합 캘린더",
                body: [
                    "수업(파랑) · 과제(주황) · 시험(빨강) · 학사일정(초록) · 공휴일이 한 달 단위로 표시됩니다.",
                    "자녀별 색상 점으로 어느 자녀의 일정인지 구분합니다.",
                    "월 이동 버튼으로 과거·미래 달을 확인할 수 있어요.",
                ],
            },
            {
                heading: "자녀 카드",
                body: [
                    "각 자녀의 진도 막대, 미제출 과제 수, 최근 시험 점수를 한 줄로 보여줍니다.",
                    "우측 '수업 기록' 버튼으로 상세 화면에 진입합니다.",
                ],
            },
        ],
    },
    school: {
        title: "학교 정보",
        subtitle: "NEIS 기반 위젯",
        sections: [
            {
                heading: "급식 위젯",
                body: [
                    "NEIS 공공데이터에서 그날의 중식(없으면 첫 끼니)을 표시합니다.",
                    "메뉴와 칼로리가 함께 나오며, 알레르기 표기는 학교 게시 기준을 따릅니다.",
                ],
            },
            {
                heading: "시간표 위젯",
                body: [
                    "자녀의 학교 종류(초/중/고)에 맞춰 자동 분기됩니다.",
                    "교과·교시가 정렬된 형태로 7교시까지 표시됩니다.",
                ],
            },
            {
                heading: "학사일정",
                body: [
                    "월간 학사 행사·휴업일이 캘린더 색상으로 표시됩니다.",
                    "학교가 NEIS에 일정을 등록한 시점에만 보이므로, 비어 있다면 학교 등록을 기다려 주세요.",
                ],
            },
            {
                heading: "정보가 안 보일 때",
                body: [
                    "자녀의 학교가 거북스쿨 프로필에 설정돼 있는지 먼저 확인하세요.",
                    "학교 코드가 NEIS에 등록돼야 정상 호출됩니다.",
                ],
            },
        ],
    },
    records: {
        title: "수업 기록",
        subtitle: "출결·과제·시험 통합 조회",
        sections: [
            {
                heading: "출결 배지",
                body: [
                    "초록 '출석' · 주황 '지각' · 빨강 '결석'으로 표시됩니다.",
                    "데이터가 없는 차시는 '—'로 표기합니다.",
                ],
            },
            {
                heading: "과제 상태",
                body: [
                    "submitted(제출완료) · graded(채점완료) · pending(미제출).",
                    "채점이 완료된 경우 점수도 함께 표시됩니다.",
                ],
            },
            {
                heading: "시험 결과",
                body: [
                    "점수 / 만점이 표기되고 선생님 피드백이 함께 표시됩니다.",
                ],
            },
        ],
    },
    chat: {
        title: "선생님과 대화하기",
        subtitle: "1:1 채팅 사용법",
        sections: [
            {
                heading: "대화 상대",
                body: [
                    "자녀별로 담당 선생님과 1:1 대화 채널이 만들어집니다.",
                    "자녀앱에서는 이 채팅이 보이지 않습니다.",
                ],
            },
            {
                heading: "메시지 보내기",
                body: [
                    "자녀를 선택한 뒤 하단 입력창에 내용을 적고 전송하세요.",
                    "본인 말풍선은 우측 정렬, 선생님은 좌측 정렬로 표시됩니다.",
                ],
            },
            {
                heading: "알림",
                body: [
                    "새 메시지가 도착하면 헤더의 🔔 알림 아이콘에 표시됩니다.",
                ],
            },
        ],
    },
    account: {
        title: "계정 · 결제",
        subtitle: "이용권과 계정 관리",
        sections: [
            {
                heading: "이용권 구매",
                body: [
                    "헤더의 💳 아이콘 또는 사용자 메뉴 → '결제내역'을 통해 tskool 상품 페이지로 이동합니다.",
                ],
            },
            {
                heading: "자녀 연결 해제",
                body: [
                    "Hub 계정연동 화면에서 자녀별로 해제 버튼을 누르면 즉시 대시보드에서 사라집니다.",
                ],
            },
            {
                heading: "로그아웃",
                body: [
                    "사용자 메뉴 → 로그아웃을 누르면 tskool SSO 세션까지 종료됩니다.",
                ],
            },
        ],
    },
};

export function generateStaticParams() {
    return Object.keys(TOPICS).map((topic) => ({ topic }));
}

export default async function HelpTopicPage({
    params,
}: {
    params: Promise<{ topic: string }>;
}) {
    const { topic } = await params;
    const data = TOPICS[topic];
    if (!data) notFound();

    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-3xl px-6 py-10">
                <Link
                    href="/help"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    도움말로
                </Link>

                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">{data.title}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{data.subtitle}</p>
                </header>

                <div className="space-y-4">
                    {data.sections.map((s, i) => (
                        <Card key={i} className="p-5">
                            <h2 className="mb-2 text-base font-semibold">{s.heading}</h2>
                            <ul className="space-y-1.5 text-sm text-muted-foreground leading-relaxed">
                                {s.body.map((line, j) => (
                                    <li key={j}>• {line}</li>
                                ))}
                            </ul>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
