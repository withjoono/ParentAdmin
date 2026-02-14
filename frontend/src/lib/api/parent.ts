/**
 * TutorBoard Parent API
 * TutorBoard 백엔드의 Parent 엔드포인트와 연동
 */

import { authClient } from './client';

// ===== Types =====

export interface ParentDashboard {
    children: ChildInfo[];
    totalChildren: number;
    pendingAssignments: number;
    avgProgress: number;
}

export interface ChildInfo {
    id: string;
    studentId: string;
    studentName: string;
    className: string;
    progressRate?: number;
    pendingAssignments?: number;
    latestScore?: number;
}

export interface AttendanceRecord {
    date: string;
    status: 'present' | 'late' | 'absent';
    note?: string;
}

export interface TimelineEntry {
    id: string;
    type: 'lesson' | 'assignment' | 'test' | 'attendance';
    title: string;
    description?: string;
    date: string;
    classId?: string;
    className?: string;
    score?: number;
    status?: string;
}

export interface TestTrend {
    testId: string;
    testTitle: string;
    date: string;
    score: number;
    maxScore: number;
    classAvg?: number;
}

export interface PrivateComment {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
    isTeacher: boolean;
}

// ===== Dashboard =====

export async function getDashboard(): Promise<ParentDashboard> {
    const response = await authClient.get('/parent/dashboard');
    return response.data;
}

// ===== Child Attendance =====

export async function getChildAttendance(
    childId: string,
    month?: string
): Promise<AttendanceRecord[]> {
    const params = month ? { month } : {};
    const response = await authClient.get(`/parent/children/${childId}/attendance`, { params });
    return response.data;
}

// ===== Child Timeline =====

export async function getChildTimeline(
    childId: string,
    classId?: string
): Promise<TimelineEntry[]> {
    const params = classId ? { classId } : {};
    const response = await authClient.get(`/parent/children/${childId}/timeline`, { params });
    return response.data;
}

// ===== Child Test Trend =====

export async function getChildTestTrend(
    childId: string,
    classId?: string
): Promise<TestTrend[]> {
    const params = classId ? { classId } : {};
    const response = await authClient.get(`/parent/children/${childId}/test-trend`, { params });
    return response.data;
}

// ===== Private Comments =====

export async function getPrivateComments(childId: string): Promise<PrivateComment[]> {
    const response = await authClient.get(`/parent/children/${childId}/comments`);
    return response.data;
}

export async function replyToComment(data: {
    targetId: string;
    studentId: string;
    contextType?: string;
    contextId?: string;
    content: string;
}): Promise<PrivateComment> {
    const response = await authClient.post('/parent/comments/reply', data);
    return response.data;
}
