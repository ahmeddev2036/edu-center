import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  // تسجيل مفتوح — يُستخدم في Onboarding وإنشاء أول مستخدم
  @Public()
  @Post('register')
  register(@Body() body: LoginDto) {
    return this.authService.register(body.email, body.password);
  }

  // إنشاء مستخدم من قِبل admin (مع تحديد الدور)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('create-user')
  createUser(@Body() body: { email: string; password: string; role: string }) {
    return this.authService.createUser(body.email, body.password, body.role || 'teacher');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  me(@CurrentUser() user: any) {
    return this.authService.getProfile(user.userId);
  }
}
