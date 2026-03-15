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

