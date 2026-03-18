import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { AttendanceRecord } from '../../entities/attendance.entity';
import { ExamResult } from '../../entities/exam-result.entity';
import { Payment } from '../../entities/payment.entity';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(Student) private readonly students: Repository<Student>,
    @InjectRepository(AttendanceRecord) private readonly attendance: Repository<AttendanceRecord>,
    @InjectRepository(ExamResult) private readonly results: Repository<ExamResult>,
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
  ) {}

  // 4.1 تحليل أداء الطالب
  async analyzeStudent(studentId: string) {
    const student = await this.students.findOne({ where: { id: studentId } });
    if (!student) return { ok: false, message: 'الطالب غير موجود' };

    const attendanceRecords = await this.attendance.find({ where: { student: { id: studentId } } });
    const examResults = await this.results.find({ where: { student: { id: studentId } }, relations: ['student'] });

    const totalSessions = attendanceRecords.length;
    const presentSessions = attendanceRecords.filter(a => a.present).length;
    const attendanceRate = totalSessions > 0 ? (presentSessions / totalSessions) * 100 : 0;

    const avgScore = examResults.length > 0
      ? examResults.reduce((s, r) => s + Number(r.score), 0) / examResults.length
      : 0;

    // تحليل ذكي بسيط
    const insights: string[] = [];
    const recommendations: string[] = [];

    if (attendanceRate < 70) {
      insights.push(`نسبة الحضور منخفضة (${attendanceRate.toFixed(0)}%)`);
      recommendations.push('يُنصح بالتواصل مع ولي الأمر لمتابعة الانتظام');
    } else if (attendanceRate >= 90) {
      insights.push(`نسبة حضور ممتازة (${attendanceRate.toFixed(0)}%)`);
    }

    if (avgScore < 50) {
      insights.push(`متوسط الدرجات ضعيف (${avgScore.toFixed(1)})`);
      recommendations.push('يحتاج الطالب لدعم إضافي ومتابعة مكثفة');
    } else if (avgScore >= 85) {
      insights.push(`أداء أكاديمي متميز (${avgScore.toFixed(1)})`);
      recommendations.push('يمكن تشجيع الطالب على المسابقات والأنشطة المتقدمة');
    }

    const riskLevel = attendanceRate < 60 || avgScore < 40 ? 'high' : attendanceRate < 75 || avgScore < 60 ? 'medium' : 'low';

    return {
      student,
      analysis: {
        attendanceRate: attendanceRate.toFixed(1),
        totalSessions,
        presentSessions,
        avgScore: avgScore.toFixed(1),
        totalExams: examResults.length,
        riskLevel,
        insights,
        recommendations,
      },
    };
  }

  // 4.2 توليد أسئلة امتحان تلقائياً
  generateExamQuestions(subject: string, level: string, count: number) {
    // في الإنتاج: استخدام OpenAI API
    // هنا: أسئلة نموذجية حسب المادة
    const templates: Record<string, any[]> = {
      رياضيات: [
        { text: 'ما ناتج 15 × 8؟', choices: ['100', '120', '110', '130'], correctAnswer: '120', type: 'mcq' },
        { text: 'ما هو الجذر التربيعي لـ 144؟', choices: ['10', '11', '12', '13'], correctAnswer: '12', type: 'mcq' },
        { text: 'احسب مساحة مستطيل طوله 8 وعرضه 5', choices: ['35', '40', '45', '30'], correctAnswer: '40', type: 'mcq' },
      ],
      علوم: [
        { text: 'ما هو الرمز الكيميائي للماء؟', choices: ['H2O', 'CO2', 'O2', 'H2'], correctAnswer: 'H2O', type: 'mcq' },
        { text: 'كم عدد كواكب المجموعة الشمسية؟', choices: ['7', '8', '9', '10'], correctAnswer: '8', type: 'mcq' },
      ],
      عربي: [
        { text: 'ما جمع كلمة "كتاب"؟', choices: ['كتابات', 'كتب', 'أكتاب', 'كتابون'], correctAnswer: 'كتب', type: 'mcq' },
        { text: 'ما مضاد كلمة "سعيد"؟', choices: ['فرح', 'مسرور', 'حزين', 'مبتهج'], correctAnswer: 'حزين', type: 'mcq' },
      ],
    };

    const questions = templates[subject] || templates['رياضيات'];
    const selected = questions.slice(0, Math.min(count, questions.length));

    // إضافة أسئلة مقالية
    if (count > selected.length) {
      selected.push({
        text: `اشرح بإيجاز أهمية مادة ${subject} في حياتنا اليومية`,
        type: 'essay',
        choices: null,
        correctAnswer: null,
      });
    }

    return {
      subject,
      level,
      questions: selected,
      generatedAt: new Date().toISOString(),
      note: 'تم التوليد تلقائياً — يُنصح بمراجعة الأسئلة قبل الاستخدام',
    };
  }

  // 4.3 تقرير ذكي شامل
  async generateSmartReport() {
    const totalStudents = await this.students.count();
    const allAttendance = await this.attendance.find();
    const allResults = await this.results.find();
    const allPayments = await this.payments.find();

    const presentCount = allAttendance.filter(a => a.present).length;
    const overallAttendanceRate = allAttendance.length > 0 ? (presentCount / allAttendance.length) * 100 : 0;
    const avgScore = allResults.length > 0 ? allResults.reduce((s, r) => s + Number(r.score), 0) / allResults.length : 0;
    const totalRevenue = allPayments.reduce((s, p) => s + Number(p.amount), 0);

    const insights: string[] = [];
    if (overallAttendanceRate < 75) insights.push('⚠️ نسبة الحضور الإجمالية تحتاج تحسين');
    if (avgScore < 60) insights.push('⚠️ المتوسط الأكاديمي العام منخفض — يُنصح بمراجعة المناهج');
    if (totalStudents > 0) insights.push(`✅ السنتر يخدم ${totalStudents} طالب حالياً`);
    if (totalRevenue > 0) insights.push(`💰 إجمالي الإيرادات: ${totalRevenue.toFixed(0)} ج.م`);

    return {
      summary: {
        totalStudents,
        overallAttendanceRate: overallAttendanceRate.toFixed(1),
        avgScore: avgScore.toFixed(1),
        totalRevenue: totalRevenue.toFixed(0),
      },
      insights,
      generatedAt: new Date().toISOString(),
    };
  }
}
