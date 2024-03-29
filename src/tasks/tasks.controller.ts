import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { SearchDto } from '../common/dto/search.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create')
  @Auth()
  async create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @Auth()
  async findByTerm(@Body() search: SearchDto, @GetUser() user: User) {
    return await this.tasksService.findByTerm(search, user);
  }

  @Get('all')
  @Auth()
  async findAll(@GetUser() user: User) {
    return await this.tasksService.findAll(user);
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Put(':id')
  @Auth()
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Patch('watch/:id')
  @Auth()
  async watch(@Param('id') id: string) {
    return this.tasksService.watch(+id);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string, @GetUser() user: User) {
    return this.tasksService.remove(+id, user);
  }
}
