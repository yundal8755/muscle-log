import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// 인증 컨트롤러
// 회원가입, 로그인, 회원 목록 조회 API 제공
@Controller('auth')
export class AuthController {
    // Controller에서는 항상 constructor를 통해 서비스를 주입한다
    constructor(private readonly authService: AuthService) { }


    // [회원가입] 엔드포인트
    // Pipe를 통해 입력값이 자동으로 검증됩니다.
    // Interceptor를 통해 응답에서 비밀번호가 자동으로 제외됩니다.
    @Post('register')
    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({
        status: 201,
        description: '회원가입 성공',
    })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }


    // [로그인] 엔드포인트
    // Pipe를 통해 입력값이 자동으로 검증됩니다.
    // Interceptor를 통해 응답에서 비밀번호가 자동으로 제외됩니다.
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({
        status: 200,
        description: '로그인 성공 및 JWT 토큰 발급',
    })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
