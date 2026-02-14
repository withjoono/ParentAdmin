/**
 * 학부모용 수업현황 API
 * TutorBoard 백엔드의 Parent 엔드포인트 활용
 * 모든 API는 읽기 전용 (GET only)
 */

import { authClient } from "./client";
import type {
    Child,
    ChildSummary,
    LessonPlan,
    Assignment,
    Test,
    CalendarEvent,
} from "@/types";

// ==================== 자녀 정보 ====================

/** 내 자녀 목록 조회 (TutorBoard Parent Dashboard에서 추출) */
export const getMyChildren = async (): Promise<Child[]> => {
    const response = await authClient.get("/parent/dashboard");
    // Dashboard API에서 자녀 목록 추출
    const data = response.data;
    return data.children || [];
};

/** 자녀별 요약 정보 */
export const getChildSummary = async (
    studentId: number
): Promise<ChildSummary> => {
    const response = await authClient.get("/parent/dashboard");
    const data = response.data;
    // Dashboard에서 해당 학생의 요약 정보 추출
    const child = (data.children || []).find(
        (c: any) => String(c.studentId) === String(studentId) || String(c.id) === String(studentId)
    );
    return child || data;
};

// ==================== 수업 진도 ====================

/** 수업 진도 목록 (Timeline API 활용) */
export const getLessonPlans = async (
    studentId: number
): Promise<LessonPlan[]> => {
    const response = await authClient.get(
        `/parent/children/${studentId}/timeline`
    );
    const timeline = response.data || [];
    // Timeline에서 lesson 타입만 필터링
    return timeline
        .filter((entry: any) => entry.type === "lesson" || !entry.type)
        .map((entry: any) => ({
            id: entry.id,
            title: entry.title,
            description: entry.description || "",
            date: entry.date,
            progress: entry.progress,
            className: entry.className || "",
            ...entry,
        }));
};

// ==================== 과제 ====================

/** 과제 목록 (Timeline API에서 assignment 타입 필터링) */
export const getAssignments = async (
    studentId: number
): Promise<Assignment[]> => {
    const response = await authClient.get(
        `/parent/children/${studentId}/timeline`
    );
    const timeline = response.data || [];
    return timeline
        .filter((entry: any) => entry.type === "assignment")
        .map((entry: any) => ({
            id: entry.id,
            title: entry.title,
            description: entry.description || "",
            dueDate: entry.date,
            status: entry.status || "미제출",
            ...entry,
        }));
};

// ==================== 테스트 ====================

/** 테스트 목록 (Test Trend API 활용) */
export const getTests = async (studentId: number): Promise<Test[]> => {
    const response = await authClient.get(
        `/parent/children/${studentId}/test-trend`
    );
    return (response.data || []).map((entry: any) => ({
        id: entry.testId || entry.id,
        title: entry.testTitle || entry.title,
        date: entry.date,
        score: entry.score,
        maxScore: entry.maxScore,
        classAvg: entry.classAvg,
        ...entry,
    }));
};

// ==================== 캘린더 ====================

/** 월별 캘린더 일정 (Attendance + Timeline 조합) */
export const getCalendarEvents = async (
    studentId: number,
    month: string
): Promise<CalendarEvent[]> => {
    try {
        const [attendanceRes, timelineRes] = await Promise.all([
            authClient.get(`/parent/children/${studentId}/attendance`, {
                params: { month },
            }),
            authClient.get(`/parent/children/${studentId}/timeline`),
        ]);

        const attendance = (attendanceRes.data || []).map((a: any) => ({
            id: `att-${a.date}`,
            title:
                a.status === "present"
                    ? "출석"
                    : a.status === "late"
                        ? "지각"
                        : "결석",
            date: a.date,
            type: "attendance" as const,
            ...a,
        }));

        const lessons = (timelineRes.data || [])
            .filter((t: any) => {
                if (!t.date) return false;
                return t.date.startsWith(month);
            })
            .map((t: any) => ({
                id: t.id,
                title: t.title,
                date: t.date,
                type: t.type || "lesson",
                ...t,
            }));

        return [...attendance, ...lessons];
    } catch (err) {
        console.error("Failed to fetch calendar events:", err);
        return [];
    }
};
