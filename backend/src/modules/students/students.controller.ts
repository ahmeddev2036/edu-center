import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { StudentsService } from './students.service';
import { CreateStudentDto, UpdateStudentDto } from './dto/create-student.dto';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly students: StudentsService) {}

  @Roles('admin', 'staff')
  @Post()
  create(@Body() body: CreateStudentDto) {
    return this.students.create(body);
  }

  @Roles('admin', 'teacher', 'staff')
  @Get()
  list() {
    return this.students.list();
  }

  @Roles('admin', 'teacher', 'staff')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.students.get(id);
  }

  @Roles('admin', 'staff')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateStudentDto) {
    return this.students.update(id, body);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.students.remove(id);
  }

  // بوابة ولي الأمر — public (يصل بكود الطالب)
  @Public()
  @Get('parent/:code')
  parentPortal(@Param('code') code: string) {
    return this.students.getParentView(code);
  }
}
