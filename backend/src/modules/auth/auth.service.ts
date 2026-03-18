import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) return { ok: false, message: 'بيانات الدخول غير صحيحة' };
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return { ok: false, message: 'بيانات الدخول غير صحيحة' };
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role, email: user.email });
    return { ok: true, token, role: user.role, email: user.email };
  }

  async register(email: string, password: string) {
    // يسمح بالتسجيل فقط إذا لم يكن هناك أي مستخدم بعد
    const count = await this.users.count();
    if (count > 0) throw new BadRequestException('التسجيل مغلق. تواصل مع المدير لإضافة حسابك.');
    const existing = await this.users.findOne({ where: { email } });
    if (existing) throw new BadRequestException('البريد الإلكتروني مستخدم بالفعل');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.save(this.users.create({ email, passwordHash, role: 'admin' }));
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role, email: user.email });
    return { ok: true, token, role: user.role, email: user.email };
  }

  async getProfile(userId: string) {
    const user = await this.users.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role', 'createdAt'],
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
