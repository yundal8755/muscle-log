import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

/**
 * 성공 응답을 Flutter 호환 포맷으로 감싸는 Interceptor
 *
 * 모든 성공 응답을 다음 형식으로 변환합니다:
 * {
 *   "success": true,
 *   "httpStatus": 200,
 *   "data": { ...실제 데이터... }
 * }
 *
 * 사용법:
 * - 전역 적용: app.useGlobalInterceptors(new SuccessResponseInterceptor())
 * - 컨트롤러 적용: @UseInterceptors(SuccessResponseInterceptor)
 */
@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();

        return next.handle().pipe(
            map((data) => {
                // HTTP 상태 코드 가져오기 (기본값 200)
                const httpStatus = response.statusCode || 200;

                // Flutter 호환 포맷으로 응답 감싸기
                return {
                    success: true,
                    httpStatus: httpStatus,
                    data: data, // string, object, array 모두 지원
                };
            }),
        );
    }
}
