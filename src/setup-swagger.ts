import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// export: 다른 파일에서 이 함수를 사용할 수 있도록 선언
// app이라는 파라미터는 반드시 Nest 앱 객체여야 한다고 타입을 지정
export function setupSwagger(app: INestApplication): void {

    // 설정을 체인처럼 연결해서 작성하는 Builder 패턴 방식
    const config = new DocumentBuilder()
        .setTitle('Muscle Log API')
        .setDescription('운동 기록 관리 API 문서')
        .setVersion('1.0')
        .addTag('Workout', '운동 기록 API')
        .addTag('Auth', '인증 API')
        // JWT Bearer 인증 추가
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'JWT 토큰을 입력하세요',
                in: 'header',
            },
            // 두 번째 파라미터 제거 (기본값 사용)
        )
        .build();

    // 문서 생성: config, app을 합쳐서 문서를 만듦
    const document = SwaggerModule.createDocument(app, config);

    // 문서 등록: 
    // - 'api': http://localhost:3000/api 주소로 접속하면 문서를 보여줘라
    // - app: 우리 앱에다가
    // - document: 이 문서를 띄워라
    SwaggerModule.setup('api', app, document);
}