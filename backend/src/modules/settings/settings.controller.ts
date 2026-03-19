import { Body, Controller, Get, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UploadService } from '../../infra/upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(
    private readonly svc: SettingsService,
    private readonly upload: UploadService,
  ) {}

  @Get() get() { return this.svc.get(); }
  @Put() update(@Body() data: any) { return this.svc.update(data); }

  @Post('upload-logo')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } }))
  async uploadLogo(@UploadedFile() file: Express.Multer.File) {
    const url = await this.upload.uploadBuffer(file.buffer, 'edu-center/logos');
    await this.svc.update({ logoUrl: url });
    return { ok: true, url };
  }
}
