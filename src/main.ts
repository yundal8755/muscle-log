import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { ExcludePasswordInterceptor } from './common/interceptors/exclude-password.interceptor';

async function bootstrap() {
  // 1. 앱 생성
  // AppModule은 애플리케이션의 루트 모듈로, 모든 다른 모듈과 서비스를 포함합니다. 
  // NestFactory.create() 메서드를 사용하여 NestJS 애플리케이션 인스턴스를 생성합니다.
  const app = await NestFactory.create(AppModule);

  // 2. 유효성 검사 설정 (ValidationPipe 전역 설정)
  // 설명: 모든 요청 데이터를 검사하는 문지기를 세우는 설정
  // 핵심: transform: true를 통해 문자열 '1'을 숫자 1로 자동 변환하여 DTO의 타입과 일치하도록 함
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성은 거름 (보안상 중요!)
      forbidNonWhitelisted: true, // DTO에 없는 속성을 보내면 에러 발생시킴
      transform: true, // 문자열 '1'을 숫자 1로 자동 변환하여 요청 데이터를 DTO 타입으로 자동 변환
    }),
  );

  // 3. Interceptor 전역 설정
  // 설명: 모든 응답에서 password 필드를 자동으로 제거하는 Interceptor
  app.useGlobalInterceptors(new ExcludePasswordInterceptor());

  // 4. Swagger 설정
  // 설명: API 문서를 만들기 위한 설정입니다. 
  // 제목, 설명 등을 적고 SwaggerModule을 통해 문서 사이트를 생성합니다.
  setupSwagger(app);

  // 5. 서버 실행
  // 설명: 3000번 포트를 열고 서버를 대기 상태로 만듭니다. 이제 외부에서 접속할 수 있습니다.
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
