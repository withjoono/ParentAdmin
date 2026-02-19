/**
 * TutorBoard API Client
 * ParentAdmin 백엔드의 /api/tutor/* 엔드포인트와 연동
 */

import { authClient } from './client';

// ===== Types =====

export interface DashboardChild {
    student: { id: string; username: string; avatarUrl: string | null };
    classes: { id: string; name: string; teacher: { id: string; username: string } }[];
    todayAttendance: { status: string; class: { name: string }; date: string }[];
    pendingAssignments: number;
}

export interface DashboardResponse {
    children: DashboardChild[];
}

export interface TimelineEntry {
    type: 'lesson' | 'test' | 'assignment';
    date: string;
    title: string;
    className: string;
    summary?: string;
    pages?: string | null;
    score?: number;
    maxScore?: number;
    percentage?: number;
    status?: string;
    grade?: number;
}

export interface TestTrendEntry {
    testTitle: string;
    className: string;
    score: number;
    maxScore: number;
    percentage: number;
    date: string;
}

export interface PrivateComment {
    id: string;
    authorId: string;
    content: string;
    imageUrl?: string | null;
    createdAt: string;
    author: { id: string; username: string; role: string; avatarUrl?: string | null };
    target: { id: string; username: string; role: string };
}

export interface ClassRecordAssignment {
    title: string;
    status: string;
    grade?: number | null;
}

export interface ClassRecordTest {
    title: string;
    score?: number | null;
    maxScore: number;
    feedback?: string | null;
}

export interface ClassRecordEntry {
    date: string;
    lessonTitle: string;
    summary: string | null;
    pages: string | null;
    attendance: string | null;
    assignments: ClassRecordAssignment[];
    tests: ClassRecordTest[];
}

export interface ClassRecordGroup {
    classId: string;
    className: string;
    subject: string;
    records: ClassRecordEntry[];
}

// ===== Dashboard =====

export async function getTutorDashboard(): Promise<DashboardResponse> {
    const response = await authClient.get('/api/tutor/dashboard');
    return response.data;
}

// ===== Timeline =====

export async function getChildTimeline(
    childId: string,
    classId?: string
): Promise<TimelineEntry[]> {
    const params = classId ? { classId } : {};
    const response = await authClient.get(`/api/tutor/children/${childId}/timeline`, { params });
    return response.data;
}

// ===== Test Trend =====

export async function getChildTestTrend(
    childId: string,
    classId?: string
): Promise<TestTrendEntry[]> {
    const params = classId ? { classId } : {};
    const response = await authClient.get(`/api/tutor/children/${childId}/test-trend`, { params });
    return response.data;
}

// ===== Private Comments =====

export async function getPrivateComments(studentId: string): Promise<PrivateComment[]> {
    const response = await authClient.get(`/api/tutor/comments/${studentId}`);
    return response.data;
}

export async function postPrivateComment(data: {
    targetId: string;
    studentId?: string;
    contextType?: string;
    contextId?: string;
    content: string;
    imageUrl?: string;
}): Promise<PrivateComment> {
    const response = await authClient.post('/api/tutor/comments', data);
    return response.data;
}

// ===== Class Records =====

export async function getChildClassRecords(
    childId: string,
    classId?: string
): Promise<ClassRecordGroup[]> {
    const params = classId ? { classId } : {};
    const response = await authClient.get(`/api/tutor/children/${childId}/class-records`, { params });
    return response.data;
}
