import { Injectable } from '@nestjs/common';
import { DataSource, Equal, Like, Repository } from 'typeorm';
import { SearchDto } from '../common/dto/search.dto';
import { Status } from '../common/enums/status.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { IProject } from './interfaces/response-project.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createProjectDto: CreateProjectDto, user: User) {
    const { name, projectType, status } = createProjectDto;
    const createdDate = new Date().toISOString();
    const project = this.projectRepository.create({
      name: name,
      projectType: projectType,
      created: createdDate,
      status: status,
      user: user,
    });
    await this.projectRepository.save(project);
    return project;
  }

  async findProjects(searchDto: SearchDto, user: User) {
    const { search, created, status, updated } = searchDto;
    const entityName = 'Projects';
    const queryRunner = await this.dataSource.createQueryBuilder(
      Project,
      entityName,
    );
    queryRunner.where(`${entityName}.user = :user`, { user: user.id });
    if (search) {
      queryRunner.andWhere(`(${entityName}.name like :name`, {
        name: `%${search}%`,
      });
      queryRunner.orWhere(`${entityName}.projectType like :projectType)`, {
        projectType: `%${search}%`,
      });
    }
    if (created) {
      const dateCreated = this._validateDates(created);
      queryRunner.andWhere(`${entityName}.created = :created`, {
        created: dateCreated,
      });
    }
    if (status) {
      queryRunner.andWhere(`${entityName}.status = :status`, {
        status: status,
      });
    }
    if (updated) {
      const dateUpdated = this._validateDates(updated);
      queryRunner.andWhere(`${entityName}.updated = :updated`, {
        updated: dateUpdated,
      });
    }

    const projects = await queryRunner.getMany();
    const response = this._transformResponse(projects);
    return response;
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOneBy({ id });
    const response: IProject = {
      id: project.id,
      name: project.name,
      projectType: project.projectType,
      created: project.created,
      status: project.status,
      updated: project.updated ? project.created : '',
      finished: project.finished ? project.created : '',
    };
    return response;
  }

  async findAll(user: User) {
    const projects = await this.projectRepository.find({
      order: { id: { direction: 'ASC' } },
      where: { user: Equal(user.id) },
    });
    const response = await this._transformResponse(projects);
    return response;
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

  private async _validateDates(date: string) {
    const validDate = await date.replace(/\//g, '-');
    return validDate;
  }

  private async _transformResponse(projectsOrm: Project[]) {
    const projectsComplete = projectsOrm;
    const projects = [];
    const total = projectsOrm.length;
    projectsComplete.forEach((project) => {
      const projectPlain: IProject = {
        id: project.id,
        name: project.name,
        projectType: project.projectType,
        created: project.created,
        finished: project.finished,
        updated: project.updated,
        status: project.status,
      };
      projects.push(projectPlain);
    });
    return { projects, total };
  }
}
