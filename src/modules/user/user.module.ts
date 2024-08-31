import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@auth/auth.module';
import { StripeService } from '@stripe/services/stripe.service';
import { UserController } from './controllers/user.controller';
import { ProfileController } from './controllers/profile.controller';
import { UserService } from './services/user.service';
import { User, UserSchema } from './schemas/user.schema';
import { AwsStorageService } from '@storages/services/aws-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, StripeService, AwsStorageService],
  controllers: [UserController, ProfileController],
  exports: [UserService],
})
export class UserModule {}
