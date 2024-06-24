import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ContactEmailDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsEmail()
  @Expose()
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsNotEmpty()
  @IsString()
  @Expose()
  phone_number: string;

  @ApiProperty({
    example: 'Hello, I would like to know more about your services.',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  message: string;
}
