import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

async function bootstrap() {
  // DB 스키마 자동 생성 (tutorboard 스키마 테이블이 없으면 생성)
  if (process.env.DATABASE_URL) {
    try {
      execSync('./node_modules/.bin/prisma db push --skip-generate --accept-data-loss', {
        stdio: 'inherit',
        timeout: 60000,
      });
      console.log('[DB] Schema sync complete');
    } catch (e) {
      console.error('[DB] Schema sync failed (continuing):', e.message);
    }
  }

  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 쿠키 파서
  app.use(cookieParser());

  // 글로벌 프리픽스
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`ParentAdmin backend running on port ${port}`);
}
bootstrap();
