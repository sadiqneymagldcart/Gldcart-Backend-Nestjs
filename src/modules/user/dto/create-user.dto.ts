import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'User surname' })
  surname?: string;

  @ApiProperty({ example: 'Buyer', description: 'User role' })
  @Transform(({ value }) => value.toLowerCase())
  role: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'User profile picture',
  })
  picture?: string;

  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}
