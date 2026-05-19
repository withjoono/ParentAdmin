import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

const NEIS_BASE = 'https://open.neis.go.kr/hub';

interface NeisCodeCache {
    atptCode: string;
    schoolCode: string;
    schoolKind: string;
}

@Injectable()
export class SchoolService {
    private readonly neisKey: string;
    private readonly codeCache = new Map<string, NeisCodeCache>();

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
    ) {
        this.neisKey = this.config.get('NEIS_API_KEY') || 'SAMPLE';
    }

    private async fetchNeis(url: string): Promise<any> {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 6000);
        try {
            const res = await fetch(url, { signal: controller.signal });
            return await res.json();
        } catch {
            return null;
        } finally {
            clearTimeout(timer);
        }
    }

    private async resolveNeisCodes(schoolCode: string): Promise<NeisCodeCache | null> {
        if (this.codeCache.has(schoolCode)) return this.codeCache.get(schoolCode)!;

        const url = `${NEIS_BASE}/schoolInfo?KEY=${this.neisKey}&Type=json&SD_SCHUL_CODE=${schoolCode}`;
        const data = await this.fetchNeis(url);
        const row = data?.schoolInfo?.[1]?.row?.[0];
        if (!row) return null;

        const info: NeisCodeCache = {
            atptCode: row.ATPT_OFCDC_SC_CODE,
            schoolCode: row.SD_SCHUL_CODE,
            schoolKind: row.SCHUL_KND_SC_NM,
        };
        this.codeCache.set(schoolCode, info);
        return info;
    }

    private async getStudentHubInfo(hubId: string, studentId: string) {
        const parent = await this.prisma.tbUser.findUnique({ where: { hubUserId: hubId } });
        if (!parent) return null;

        const enrollment = await this.prisma.tbClassEnrollment.findFirst({
            where: { parentId: parent.id, studentId },
        });
        if (!enrollment) return null;

        const student = await this.prisma.tbUser.findUnique({
            where: { id: studentId },
            select: { hubUserId: true, username: true },
        });
        if (!student?.hubUserId) return null;

        const memberInfo = await this.prisma.auth_member_s.findUnique({
            where: { member_id: student.hubUserId },
        });

        return { studentName: student.username, memberInfo };
    }

    async getSchoolInfo(hubId: string, studentId: string) {
        const data = await this.getStudentHubInfo(hubId, studentId);
        if (!data) return null;
        const { memberInfo } = data;
        return {
            schoolName: memberInfo?.school_name ?? null,
            schoolLevel: memberInfo?.school_level ?? null,
            grade: memberInfo?.grade ?? null,
            hasSchoolCode: !!memberInfo?.school_code,
        };
    }

    async getMenu(hubId: string, studentId: string, date: string) {
        const data = await this.getStudentHubInfo(hubId, studentId);
        if (!data?.memberInfo?.school_code) return [];

        const neis = await this.resolveNeisCodes(data.memberInfo.school_code);
        if (!neis) return [];

        const url = `${NEIS_BASE}/mealServiceDietInfo?KEY=${this.neisKey}&Type=json&ATPT_OFCDC_SC_CODE=${neis.atptCode}&SD_SCHUL_CODE=${neis.schoolCode}&MLSV_YMD=${date}`;
        const raw = await this.fetchNeis(url);
        const rows: any[] = raw?.mealServiceDietInfo?.[1]?.row || [];

        return rows.map((r) => ({
            mealType: r.MMEAL_SC_NM,
            menu: (r.DDISH_NM || '').split('<br/>').map((m: string) => m.replace(/\s*\(.*?\)/, '').trim()).filter(Boolean),
            kcal: r.CAL_INFO,
        }));
    }

    async getTimetable(hubId: string, studentId: string, date: string) {
        const data = await this.getStudentHubInfo(hubId, studentId);
        if (!data?.memberInfo?.school_code) return [];

        const neis = await this.resolveNeisCodes(data.memberInfo.school_code);
        if (!neis) return [];

        const grade = data.memberInfo.grade || 1;
        const kind = neis.schoolKind || data.memberInfo.school_level || '';
        let apiName = 'misTimetable';
        if (kind.includes('초등')) apiName = 'elsTimetable';
        else if (kind.includes('고등')) apiName = 'hisTimetable';

        const url = `${NEIS_BASE}/${apiName}?KEY=${this.neisKey}&Type=json&ATPT_OFCDC_SC_CODE=${neis.atptCode}&SD_SCHUL_CODE=${neis.schoolCode}&ALL_TI_YMD=${date}&GRADE=${grade}&CLASS_NM=1`;
        const raw = await this.fetchNeis(url);
        const rows: any[] = raw?.[apiName]?.[1]?.row || [];

        const seen = new Set<number>();
        const result: { period: number; subject: string }[] = [];
        for (const r of rows) {
            const period = parseInt(r.PERIO, 10);
            if (!seen.has(period)) {
                seen.add(period);
                result.push({ period, subject: r.ITRT_CNTNT });
            }
        }
        return result.sort((a, b) => a.period - b.period);
    }

    async getSchedule(hubId: string, studentId: string, yearMonth: string) {
        const data = await this.getStudentHubInfo(hubId, studentId);
        if (!data?.memberInfo?.school_code) return [];

        const neis = await this.resolveNeisCodes(data.memberInfo.school_code);
        if (!neis) return [];

        const from = `${yearMonth}01`;
        const to = `${yearMonth}31`;
        const url = `${NEIS_BASE}/SchoolSchedule?KEY=${this.neisKey}&Type=json&ATPT_OFCDC_SC_CODE=${neis.atptCode}&SD_SCHUL_CODE=${neis.schoolCode}&AA_FROM_YMD=${from}&AA_TO_YMD=${to}`;
        const raw = await this.fetchNeis(url);
        const rows: any[] = raw?.SchoolSchedule?.[1]?.row || [];

        return rows.map((r) => ({
            date: r.AA_YMD,
            name: r.EVENT_NM,
            isHoliday: r.SBTR_DD_SC_NM === '공휴일' || r.SBTR_DD_SC_NM === '휴업일',
        }));
    }
}
