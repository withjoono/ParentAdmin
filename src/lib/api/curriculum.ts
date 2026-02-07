/**
 * 학부모용 수업현황 API
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

/** 내 자녀 목록 조회 */
export const getMyChildren = async (): Promise<Child[]> => {
    const response = await authClient.get("/curriculum/parent/children");
    return response.data.data;
};

/** 자녀별 요약 정보 */
export const getChildSummary = async (
    studentId: number
): Promise<ChildSummary> => {
    const response = await authClient.get("/curriculum/parent/summary", {
        params: { studentId },
    });
    return response.data.data;
};

// ==================== 수업 진도 ====================

/** 수업 진도 목록 */
export const getLessonPlans = async (
    studentId: number
): Promise<LessonPlan[]> => {
    const response = await authClient.get("/curriculum/parent/lesson-plans", {
        params: { studentId },
    });
    return response.data.data;
};

// ==================== 과제 ====================

/** 과제 목록 (자녀의 제출 상태 포함) */
export const getAssignments = async (
    studentId: number
): Promise<Assignment[]> => {
    const response = await authClient.get("/curriculum/parent/assignments", {
        params: { studentId },
    });
    return response.data.data;
};

// ==================== 테스트 ====================

/** 테스트 목록 (자녀의 점수 포함) */
export const getTests = async (studentId: number): Promise<Test[]> => {
    const response = await authClient.get("/curriculum/parent/tests", {
        params: { studentId },
    });
    return response.data.data;
};

// ==================== 캘린더 ====================

/** 월별 캘린더 일정 */
export const getCalendarEvents = async (
    studentId: number,
    month: string
): Promise<CalendarEvent[]> => {
    const response = await authClient.get("/curriculum/parent/calendar", {
        params: { studentId, month },
    });
    return response.data.data;
};
