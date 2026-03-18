import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MediaService } from './media.service';
import { CreateVideoDto } from './dto/create-video.dto';

@ApiTags('Media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Roles('admin', 'teacher')
  @Post('videos')
  create(@Body() body: CreateVideoDto) {
    return this.media.createVideo(body);
  }

  @Roles('admin', 'teacher', 'student', 'parent')
  @Get('videos')
  list() {
    return this.media.listVideos();
  }
}
