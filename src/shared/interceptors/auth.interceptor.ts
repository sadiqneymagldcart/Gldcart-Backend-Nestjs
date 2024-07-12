import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { setRefreshTokenCookie } from '@common/utils/auth.response.util';
import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class AuthInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(AuthInterceptor.name);

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    this.logger.log(
      `REST request to ${request.url}: ${JSON.stringify(request.body)}`,
    );

    return next.handle().pipe(
      map((data) => {
        if (data.refreshToken) {
          setRefreshTokenCookie(response, data.refreshToken);
          this.logger.debug(`Setting refresh token cookie`);
          return plainToInstance(AuthResponseDto, data);
        }
        return data;
      }),
    );
  }
}
