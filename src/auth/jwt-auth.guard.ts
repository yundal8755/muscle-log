import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 인증 Guard
 * 
 * 사용법: 컨트롤러나 특정 라우트에 @UseGuards(JwtAuthGuard)를 추가하여 보호
 * Guard가 실행되면 자동으로 JwtStrategy의 validate 메서드가 호출됩니다.
 * 
 * 동작 순서:
 * 1. 요청 헤더에서 JWT 토큰 추출
 * 2. JWT 서명 검증
 * 3. JwtStrategy.validate() 호출
 * 4. 사용자 정보를 request.user에 저장
 * 5. 컨트롤러 메서드 실행
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }
