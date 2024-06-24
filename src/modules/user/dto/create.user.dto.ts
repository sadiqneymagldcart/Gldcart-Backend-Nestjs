import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'User surname' })
  surname?: string;

  @ApiProperty({ example: 'buyer', description: 'User role' })
  role: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', description: 'User profile picture' })
  profile_picture?: string;

  @ApiProperty({ example: 'example@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  password: string;
}
