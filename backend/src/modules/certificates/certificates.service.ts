import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class CertificatesService {
  async generatePdf(data: {
    studentName: string;
    examTitle: string;
    score: number;
    grade: string;
  }): Promise<Buffer> {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));

    // Title
    doc.fontSize(24).text('شهادة تقدير', { align: 'center' });
    doc.moveDown();

    // Content
    doc.fontSize(16).text(`الطالب/ة: ${data.studentName}`);
    doc.text(`الامتحان: ${data.examTitle}`);
    doc.text(`الدرجة: ${data.score}`);
    doc.text(`التقدير: ${data.grade}`);
    doc.moveDown();

    doc.fontSize(12).text(`تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}`);
    doc.end();

    return new Promise<Buffer>(resolve => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }
}
