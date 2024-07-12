import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '@user/dto/update-user.dto';

@Injectable()
export class ProfileService {
  public constructor(private readonly userService: UserService) { }

  public async updateAvatar(id: string, image: string) {
    return await this.userService.update(id, {
      profile_picture: image,
    });
  }

  public async updateProfile(id: string, data: UpdateUserDto) {
    return await this.userService.update(id, data);
  }
}
