import {
  Body,
  Controller,
  Param,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AwsStorageService } from '@storages/services/storages.service';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { ProfileService } from '@user/services/profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  public constructor(
    private readonly profileService: ProfileService,
    private readonly awsStorage: AwsStorageService,
  ) { }

  @Put('/:id/avatar')
  @UseInterceptors(FileInterceptor('image'))
  public async updateAvatar(
    @UploadedFiles() file: Express.Multer.File,
    @Param('id') id: string,
  ) {
    const image = await this.awsStorage.uploadSingleFile(file);
    return this.profileService.updateAvatar(id, image);
  }

  @Put('/:id')
  public async updateProfile(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ) {
    return this.profileService.updateProfile(id, data);
  }
}
