/**
 * 학부모 앱 타입 정의
 */

// ==================== 자녀 정보 ====================

export interface Child {
    studentId: number;
    name: string;
    grade: number;
    school?: string;
    profileImage?: string;
    classes: ChildClass[];
}

export interface ChildClass {
    classId: string;
    className: string;
    teacherName: string;
}

export interface ChildSummary {
    studentId: number;
    studentName: string;
    progressRate: number;
    pendingAssignments: number;
    latestScore?: number;
    latestScoreSubject?: string;
    className?: string;
}

// ==================== 수업 진도 ====================

export interface LessonPlan {
    id: number;
    classId: string;
    week: number;
    title: string;
    description?: string;
    subject: string;
    scheduledDate: string;
    progress: number;
    status: "scheduled" | "in_progress" | "completed";
    updatedAt: string;
}

// ==================== 과제 ====================

export interface Assignment {
    id: number;
    title: string;
    description?: string;
    dueDate: string;
    subject: string;
    fileUrl?: string;
    submission?: AssignmentSubmission;
}

export interface AssignmentSubmission {
    id: number;
    submittedAt?: string;
    grade?: number;
    feedback?: string;
    fileUrl?: string;
}

// ==================== 테스트 ====================

export interface Test {
    id: number;
    title: string;
    description?: string;
    testDate: string;
    maxScore: number;
    subject: string;
    result?: TestResult;
}

export interface TestResult {
    id: number;
    score: number;
    feedback?: string;
    takenAt: string;
}

// ==================== 캘린더 ====================

export interface CalendarEvent {
    date: string;
    type: "lesson" | "assignment_due" | "test";
    title: string;
    status?: string;
}
