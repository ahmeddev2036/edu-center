import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { StaffService } from './staff.service';
import { CreateStaffDto, UpdateStaffDto } from './dto/create-staff.dto';

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staff: StaffService) {}

  @Roles('admin')
  @Post()
  create(@Body() body: CreateStaffDto) {
    return this.staff.create(body);
  }

  @Roles('admin', 'staff')
  @Get()
  list() {
    return this.staff.list();
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateStaffDto) {
    return this.staff.update(id, body);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staff.remove(id);
  }
}
