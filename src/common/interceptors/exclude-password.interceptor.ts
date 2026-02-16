import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 비밀번호 제외 Interceptor
 * 
 * 모든 응답에서 password 필드를 자동으로 제거합니다.
 * 객체, 배열, 중첩 객체 모두 지원합니다.
 * 
 * 사용법: 
 * - 전역 적용: app.useGlobalInterceptors(new ExcludePasswordInterceptor())
 * - 컨트롤러 적용: @UseInterceptors(ExcludePasswordInterceptor)
 */
@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                return this.removePasswordFields(data);
            }),
        );
    }

    /**
     * 재귀적으로 password 필드를 제거하는 메서드
     */
    private removePasswordFields(data: any): any {
        // null 또는 undefined 체크
        if (data === null || data === undefined) {
            return data;
        }

        // 배열인 경우
        if (Array.isArray(data)) {
            return data.map((item) => this.removePasswordFields(item));
        }

        // 객체인 경우
        if (typeof data === 'object') {
            const result = { ...data };

            // password 필드 제거
            if ('password' in result) {
                delete result.password;
            }

            // 중첩된 객체도 재귀적으로 처리
            for (const key in result) {
                if (result.hasOwnProperty(key)) {
                    result[key] = this.removePasswordFields(result[key]);
                }
            }

            return result;
        }

        // 원시 타입은 그대로 반환
        return data;
    }
}
