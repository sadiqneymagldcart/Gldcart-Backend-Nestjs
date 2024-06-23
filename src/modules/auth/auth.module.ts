import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserModule } from '@user/user.module';
import { TokenModule } from '@token/token.module';

@Module({
  imports: [forwardRef(() => UserModule), TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
