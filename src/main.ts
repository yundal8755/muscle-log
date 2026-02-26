import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { ExcludePasswordInterceptor } from './common/interceptors/exclude-password.interceptor';
import { SuccessResponseInterceptor } from './common/interceptors/success-response.interceptor';
import { CustomExceptionFilter } from './common/filters/custom-exception.filter';

async function bootstrap() {
  // 앱 생성
  // AppModule은 애플리케이션의 루트 모듈로, 모든 다른 모듈과 서비스를 포함합니다. 
  // NestFactory.create() 메서드를 사용하여 NestJS 애플리케이션 인스턴스를 생성합니다.
  const app = await NestFactory.create(AppModule);

  // Middleware 설정 (예: CORS, Helmet 등)
  app.enableCors(); // CORS 활성화

  // 간단한 로깅 미들웨어 예시 (누가 어떤 주소로 요청했는지 터미널에 찍기)
  app.use((req, res, next) => {
    console.log(`[Middleware - 요청 도착] ${req.method} ${req.url}`);
    res.on('finish', () => {
      console.log('[Middleware - 응답 보냄] ', res.statusCode);
    });
    next();
  });

  // Guard 설정은 각 컨트롤러나 라우트 핸들러에서 @UseGuards() 데코레이터를 사용하여 적용할 수 있습니다.
  // ⚠️ 주의: 인증 가드는 보통 전역으로 쓰지 않고 Controller에 직접 붙입니다!

  // Interceptor 설정
  // SuccessResponseInterceptor: 성공 응답을 Flutter 호환 포맷으로 감싸기
  // ExcludePasswordInterceptor: password 필드 제거하기
  app.useGlobalInterceptors(
    new SuccessResponseInterceptor(), // 먼저 데이터를 감싸고
    new ExcludePasswordInterceptor(), // 그 다음 password를 제거
  );

  // Pipe 설정
  // 유효성 검사와 데이터 변환을 위한 전역 Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성은 거름 (보안상 중요!)
      forbidNonWhitelisted: true, // DTO에 없는 속성을 보내면 에러 발생시킴
      transform: true, // 문자열 '1'을 숫자 1로 자동 변환하여 요청 데이터를 DTO 타입으로 자동 변환
    }),
  );

  // Exception Filter 설정
  app.useGlobalFilters(new CustomExceptionFilter());

  // Swagger 설정
  setupSwagger(app);

  // 서버 실행
  // 이제 외부에서 접속할 수 있습니다.
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
