import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CertificatesService } from './certificates.service';

@ApiTags('Certificates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificates: CertificatesService) {}

  @Roles('admin', 'teacher')
  @Post('generate')
  async generate(
    @Body() body: { studentName: string; examTitle: string; score: number; grade: string },
    @Res() res: Response
  ) {
    const pdf = await this.certificates.generatePdf(body);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="certificate-${Date.now()}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Roles('admin', 'teacher')
  @Post('generate/base64')
  async generateBase64(
    @Body() body: { studentName: string; examTitle: string; score: number; grade: string }
  ) {
    const pdf = await this.certificates.generatePdf(body);
    return { ok: true, pdfBase64: pdf.toString('base64') };
  }
}
