import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly enabled: boolean;

  constructor() {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
    this.enabled = !!(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);
    if (this.enabled) {
      cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
      });
    }
  }

  async uploadBuffer(buffer: Buffer, folder = 'edu-center'): Promise<string> {
    if (!this.enabled) {
      this.logger.warn('Cloudinary not configured, returning placeholder URL');
      return 'https://placehold.co/200x200?text=Logo';
    }
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder, resource_type: 'image' }, (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload failed'));
        resolve(result.secure_url);
      }).end(buffer);
    });
  }
}
