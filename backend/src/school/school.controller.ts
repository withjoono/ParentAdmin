import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SchoolService } from './school.service';

function todayKST(): string {
    return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, '');
}

function thisMonthKST(): string {
    return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 7).replace(/-/g, '');
}

@Controller('tutor/school')
@UseGuards(AuthGuard('jwt'))
export class SchoolController {
    constructor(private readonly schoolService: SchoolService) {}

    private hubId(req: any): string {
        return req.user.jti;
    }

    @Get('info/:studentId')
    getInfo(@Req() req: any, @Param('studentId') studentId: string) {
        return this.schoolService.getSchoolInfo(this.hubId(req), studentId);
    }

    @Get('menu/:studentId')
    getMenu(
        @Req() req: any,
        @Param('studentId') studentId: string,
        @Query('date') date?: string,
    ) {
        return this.schoolService.getMenu(this.hubId(req), studentId, date || todayKST());
    }

    @Get('timetable/:studentId')
    getTimetable(
        @Req() req: any,
        @Param('studentId') studentId: string,
        @Query('date') date?: string,
    ) {
        return this.schoolService.getTimetable(this.hubId(req), studentId, date || todayKST());
    }

    @Get('schedule/:studentId')
    getSchedule(
        @Req() req: any,
        @Param('studentId') studentId: string,
        @Query('yearMonth') yearMonth?: string,
    ) {
        return this.schoolService.getSchedule(this.hubId(req), studentId, yearMonth || thisMonthKST());
    }
}
