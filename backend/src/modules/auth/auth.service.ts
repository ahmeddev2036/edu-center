import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async getProfile(userId: string) {
    const user = await this.users.findOne({
      where: { id: userId },
      select: ['id', 'email', 'role', 'createdAt'],
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
