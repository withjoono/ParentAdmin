import { Controller, Get, Post, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TutorService } from './tutor.service';

@Controller('tutor')
@UseGuards(AuthGuard('jwt'))
export class TutorController {
    constructor(private readonly tutorService: TutorService) { }

    private getHubId(req: any): string {
        return req.user.jti;
    }

    // ===== DASHBOARD =====
    @Get('dashboard')
    getDashboard(@Req() req: any) {
        return this.tutorService.getParentDashboard(this.getHubId(req));
    }

    // ===== CHILDREN (자녀 정보) =====
    @Get('children/:childId/timeline')
    getChildTimeline(
        @Req() req: any,
        @Param('childId') childId: string,
        @Query('classId') classId?: string,
    ) {
        return this.tutorService.getChildTimeline(this.getHubId(req), childId, classId);
    }

    @Get('children/:childId/test-trend')
    getChildTestTrend(
        @Req() req: any,
        @Param('childId') childId: string,
        @Query('classId') classId?: string,
    ) {
        return this.tutorService.getChildTestTrend(this.getHubId(req), childId, classId);
    }

    // ===== PRIVATE COMMENTS =====
    @Post('comments')
    createPrivateComment(
        @Req() req: any,
        @Body() body: {
            targetId: string; studentId?: string; contextType?: string;
            contextId?: string; content: string; imageUrl?: string;
        },
    ) {
        return this.tutorService.createPrivateComment(this.getHubId(req), body);
    }

    @Get('comments/:studentId')
    getPrivateComments(@Req() req: any, @Param('studentId') studentId: string) {
        return this.tutorService.getPrivateComments(this.getHubId(req), studentId);
    }

    // ===== CLASS RECORDS (공유 수업 기록) =====
    @Get('children/:childId/class-records')
    getChildClassRecords(
        @Req() req: any,
        @Param('childId') childId: string,
        @Query('classId') classId?: string,
    ) {
        return this.tutorService.getChildClassRecords(this.getHubId(req), childId, classId);
    }
}
