"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const jwt_1 = require("@nestjs/jwt");
let AppController = AppController_1 = class AppController {
    appService;
    jwtService;
    logger = new common_1.Logger(AppController_1.name);
    constructor(appService, jwtService) {
        this.appService = appService;
        this.jwtService = jwtService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async exchangeSsoCode(body) {
        const { code } = body;
        if (!code)
            throw new common_1.BadRequestException('SSO 코드가 필요합니다.');
        const hubBaseUrl = process.env.HUB_BASE_URL || 'https://ts-back-nest-479305.du.r.appspot.com';
        try {
            this.logger.log(`[SSO] Hub Backend에 코드 검증 요청: ${code.substring(0, 20)}...`);
            const response = await fetch(`${hubBaseUrl}/auth/sso/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, serviceId: 'parentadmin' }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new common_1.UnauthorizedException(result.message || 'SSO 코드가 유효하지 않습니다.');
            }
            const hubData = result.data || result;
            const memberId = hubData.memberId;
            if (!memberId) {
                throw new common_1.UnauthorizedException('SSO 인증 정보가 올바르지 않습니다.');
            }
            const accessToken = this.jwtService.sign({ jti: memberId, sub: 'ATK' });
            const refreshToken = this.jwtService.sign({ jti: memberId, sub: 'RTK' }, { expiresIn: '7d' });
            this.logger.log(`[SSO] ParentAdmin 토큰 발급 완료 (memberId=${memberId})`);
            return {
                accessToken,
                refreshToken,
                tokenExpiry: 7200,
            };
        }
        catch (error) {
            this.logger.error(`[SSO] 코드 교환 에러: ${error.message}`);
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            throw new common_1.BadRequestException('SSO 인증 처리 중 오류가 발생했습니다.');
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Post)('auth/sso/exchange'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "exchangeSsoCode", null);
exports.AppController = AppController = AppController_1 = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        jwt_1.JwtService])
], AppController);
//# sourceMappingURL=app.controller.js.map