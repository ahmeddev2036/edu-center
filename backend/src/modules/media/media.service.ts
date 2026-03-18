import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../../entities/video.entity';

@Injectable()
export class MediaService {
  constructor(@InjectRepository(Video) private readonly videos: Repository<Video>) {}

  createVideo(data: Partial<Video>) {
    const v = this.videos.create(data);
    return this.videos.save(v);
  }

  listVideos() {
    return this.videos.find();
  }
}
