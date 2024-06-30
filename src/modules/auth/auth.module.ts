import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '@user/user.module';
import { TokenModule } from '@token/token.module';
import { GoogleAuthController } from './controllers/google.auth.controller';
import { GoogleAuthService } from './services/google.auth.service';

@Module({
  imports: [forwardRef(() => UserModule), TokenModule],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, GoogleAuthService],
})
export class AuthModule {}
