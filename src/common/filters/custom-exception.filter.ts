import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        // 1. HTTP 상태 코드 추출 (예: 400, 401, 404)
        const status = exception.getStatus();

        // 2. NestJS 기본 에러 객체 추출
        const exceptionResponse = exception.getResponse();

        let message = '요청 처리에 실패했습니다.';
        let code = 'ERROR';

        // 3. class-validator 등에서 넘어온 상세 메시지와 코드 정제
        if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            const resMessage = (exceptionResponse as any).message;

            // 에러 메시지가 배열일 경우 (예: 유효성 검사 에러가 여러 개일 때) 첫 번째 메시지만 추출
            message = Array.isArray(resMessage) ? resMessage[0] : resMessage;

            // 'Bad Request' 같은 문자열을 'BAD_REQUEST' 형태의 코드로 변환
            const errorTitle = (exceptionResponse as any).error;
            code = errorTitle ? errorTitle.toUpperCase().replace(/\s/g, '_') : `HTTP_${status}`;
        } else if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
        }

        // 4. Flutter의 ApiResponse.fromJson 로직에 완벽히 호환되는 JSON 응답 반환!
        response.status(status).json({
            success: false,
            httpStatus: status,
            // Flutter 코드에서 json['data']를 ErrorData.fromJson으로 파싱하므로 여기에 담습니다.
            data: {
                code: code,
                message: message,
                httpStatus: status,
            },
        });
    }
}
