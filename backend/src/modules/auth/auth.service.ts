import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role, email: user.email });
    return { ok: true, token, role: user.role, email: user.email };
  }

  async register(email: string, password: string, role = 'admin') {
    const existing = await this.users.findOne({ where: { email } });
    if (existing) throw new ConflictException('البريد الإلكتروني مستخدم بالفعل');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.users.save(
      this.users.create({ email, passwordHash, role }),
    );
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

  // إضافة مستخدم من قِبل admin
  async createUser(email: string, password: string, role: string) {
    return this.register(email, password, role);
  }
}
