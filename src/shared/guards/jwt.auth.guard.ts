import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from '@token/services/token.service';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly tokenService: TokenService;

  public constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException('Token not provided');
    }
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token');
    }
    try {
      request.user = this.tokenService.verifyAccessToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }
}
