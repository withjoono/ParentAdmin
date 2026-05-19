import { authClient } from './client';

export interface SchoolMenuMeal {
    mealType: string;
    menu: string[];
    kcal: string;
}

export interface TimetableEntry {
    period: number;
    subject: string;
}

export interface ScheduleEvent {
    date: string;
    name: string;
    isHoliday: boolean;
}

async function safeGet<T>(url: string, params?: Record<string, string>): Promise<T | null> {
    try {
        const res = await authClient.get(url, { params });
        return res.data ?? null;
    } catch {
        return null;
    }
}

export async function getSchoolMenu(studentId: string, date?: string): Promise<SchoolMenuMeal[]> {
    const result = await safeGet<SchoolMenuMeal[]>(`/api/tutor/school/menu/${studentId}`, date ? { date } : undefined);
    return result || [];
}

export async function getSchoolTimetable(studentId: string, date?: string): Promise<TimetableEntry[]> {
    const result = await safeGet<TimetableEntry[]>(`/api/tutor/school/timetable/${studentId}`, date ? { date } : undefined);
    return result || [];
}

export async function getSchoolSchedule(studentId: string, yearMonth?: string): Promise<ScheduleEvent[]> {
    const result = await safeGet<ScheduleEvent[]>(`/api/tutor/school/schedule/${studentId}`, yearMonth ? { yearMonth } : undefined);
    return result || [];
}
