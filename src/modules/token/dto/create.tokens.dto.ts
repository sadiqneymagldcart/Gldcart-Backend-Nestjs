import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTokenDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the user.',
  })
  @IsNotEmpty({ message: 'ID is required' })
  @Expose()
  @Transform(({ value }) => value.toString())
  _id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'The email address of the user.',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Expose()
  email: string;
}
