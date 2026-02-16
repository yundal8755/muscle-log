import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * 회원가입 DTO
 * Pipe를 통한 검증이 자동으로 수행됩니다.
 */
export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: '사용자 이메일',
    })
    @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
    @IsNotEmpty({ message: '이메일은 필수 항목입니다.' })
    email: string;

    @ApiProperty({
        example: 'password123',
        description: '비밀번호 (최소 6자)',
        minLength: 6,
    })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 항목입니다.' })
    password: string;

    @ApiProperty({
        example: '홍길동',
        description: '사용자 이름',
    })
    @IsString({ message: '이름은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '이름은 필수 항목입니다.' })
    name: string;
}
