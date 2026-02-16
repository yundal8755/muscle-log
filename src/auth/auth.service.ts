import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

/**
 * Auth 서비스
 * JWT 토큰 생성, 사용자 인증 및 회원가입 처리
 */
@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    /**
     * 회원가입
     * 비밀번호를 bcrypt로 해싱하여 저장
     */
    async register(registerDto: RegisterDto) {
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // 사용자 생성
        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashedPassword,
                name: registerDto.name,
            },
        });

        // JWT 토큰 생성
        const token = this.generateToken(user.id, user.email);

        return {
            user,
            access_token: token,
        };
    }

    /**
     * 로그인
     * 이메일과 비밀번호를 검증하고 JWT 토큰 발급
     */
    async login(loginDto: LoginDto) {
        // 사용자 조회
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        // 비밀번호 검증
        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }

        // JWT 토큰 생성
        const token = this.generateToken(user.id, user.email);

        return {
            user,
            access_token: token,
        };
    }

    /**
     * JWT 토큰 생성
     */
    private generateToken(userId: number, email: string): string {
        const payload = { sub: userId, email };
        return this.jwtService.sign(payload);
    }

    /**
     * 사용자 ID로 사용자 조회 (JWT 검증 후 사용)
     */
    async findUserById(userId: number) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
}
