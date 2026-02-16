import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 현재 사용자 데코레이터
 * 
 * JWT Guard를 통과한 후 request.user에 저장된 사용자 정보를 추출합니다.
 * 
 * 사용법:
 * @UseGuards(JwtAuthGuard)
 * async someMethod(@User() user: any) {
 *   // user.id, user.email 등 사용 가능
 * }
 * 
 * 특정 필드만 추출:
 * async someMethod(@User('id') userId: number) {
 *   // userId만 추출
 * }
 */
export const User = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // 특정 필드만 요청한 경우 (예: @User('id'))
        return data ? user?.[data] : user;
    },
);
