import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../../entities/settings.entity';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { UploadService } from '../../infra/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Settings])],
  providers: [SettingsService, UploadService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
