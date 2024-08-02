import { Module, forwardRef } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { TokenModule } from '@token/token.module';
import { GoogleAuthController } from './controllers/google.auth.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google.auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [forwardRef(() => UserModule), TokenModule, HttpModule],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, GoogleAuthService],
})
export class AuthModule { }
