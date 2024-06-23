import { Logger, Module } from '@nestjs/common';
import { TokenService } from './services/token.service';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshToken, RerfreshTokenSchema } from './schemas/token.schema';

@Module({
        imports: [
                MongooseModule.forFeature([
                        { name: RefreshToken.name, schema: RerfreshTokenSchema },
                ]),
        ],
        providers: [TokenService, Logger, JwtService],
        exports: [TokenService],
})
export class TokenModule { }
