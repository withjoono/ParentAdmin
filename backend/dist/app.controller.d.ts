import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
export declare class AppController {
    private readonly appService;
    private readonly jwtService;
    private readonly logger;
    constructor(appService: AppService, jwtService: JwtService);
    getHello(): string;
    exchangeSsoCode(body: {
        code: string;
    }): Promise<{
        accessToken: string;
        refreshToken: string;
        tokenExpiry: number;
    }>;
}
