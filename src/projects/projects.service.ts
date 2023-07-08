import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { SearchDto } from '../common/dto/search.dto';
import { Status } from '../common/enums/status.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    const { name, projectType, status } = createProjectDto;
    const createdDate = new Date().toISOString();
    const project = this.projectRepository.create({
      name: name,
      projectType: projectType,
      created: createdDate,
      status: status,
    });
    await this.projectRepository.save(project);
    return project;
  }

  async findProjects(searchDto: SearchDto) {
    const { search, created, status } = searchDto;
    if (search) {
      const project = await this.projectRepository.findAndCount({
        where: [
          {
            name: Like(`%${search}%`),
          },
          {
            projectType: Like(`%${search}%`),
          },
        ],
      });
      return project;
    }

    if (created) {
      const project = await this.projectRepository.findAndCount({
        where: {
          created: created,
        },
      });
      return project;
    }

    if (status) {
      const project = await this.projectRepository.findAndCount({
        where: {
          status: status,
        },
      });
      return project;
    }
  }

  findOne(id: number) {
    return this.projectRepository.findBy({ id });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const { name, projectType, status } = updateProjectDto;
    const project = await this.projectRepository.preload({
      id,
      name,
      projectType,
      status,
    });
    const trans = await this._startTransaction();
    try {
      if (status === Status.FINISHED) {
        project.status = Status.FINISHED;
        project.finished = new Date().toISOString();
      }
      await trans.manager.save(project);
      await trans.commitTransaction();
      await trans.release();
    } catch (error) {
      await trans.rollbackTransaction();
      await trans.release();
    }
  }

  async remove(id: number) {
    const project = await this.projectRepository.findOneBy({ id });
    await this.projectRepository.remove(project);
  }

  private async _startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
