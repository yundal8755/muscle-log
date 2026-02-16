import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

/**
 * JWT 전략
 * JWT 토큰을 검증하고 사용자 정보를 추출하는 전략
 * Guard에서 자동으로 호출됩니다.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            // Authorization 헤더에서 Bearer 토큰 추출
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 만료된 토큰 거부
            ignoreExpiration: false,
            // JWT 서명 검증에 사용할 시크릿 키
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    /**
     * JWT 토큰이 유효하면 자동으로 호출되는 메서드
     * payload: JWT에서 추출된 데이터 (sub: userId, email 등)
     * 반환값은 request.user에 저장됩니다.
     */
    async validate(payload: any) {
        const user = await this.authService.findUserById(payload.sub);
        return user; // request.user에 저장됨
    }
}
