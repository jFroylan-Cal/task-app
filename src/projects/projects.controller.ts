import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/decorators/auth.decorator';
import { SearchDto } from '../common/dto/search.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Auth()
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() user: User) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @Auth()
  findProjects(@Body() searchDto: SearchDto, @GetUser() user: User) {
    return this.projectsService.findProjects(searchDto, user);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
