import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { AuthModule } from '@auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { StripeService } from '@stripe/services/stripe.service';
import { ProfileController } from './controllers/profile.controller';
import { AwsStorageService } from '@storages/services/storages.service';
import { ProfileService } from './services/profile.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, StripeService, AwsStorageService, ProfileService],
  controllers: [UserController, ProfileController],
  exports: [UserService],
})
export class UserModule {}
