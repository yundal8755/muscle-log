import { ApiProperty } from '@nestjs/swagger';

/**
 * User 엔티티
 * API 응답에서 사용되는 User 타입 정의
 * 실제 비밀번호는 Interceptor에 의해 자동으로 제외됩니다.
 */
export class UserEntity {
    @ApiProperty({ example: 1, description: '사용자 ID' })
    id: number;

    @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
    email: string;

    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    name: string;

    @ApiProperty({ description: '생성일시' })
    createdAt: Date;

    @ApiProperty({ description: '수정일시' })
    updatedAt: Date;

    // password 필드는 의도적으로 포함하지 않음 (Interceptor에서 제외)
}
