import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { SearchDto } from '../common/dto/search.dto';
import { Status } from '../common/enums/status.enum';
import { PlateGenerator } from '../common/utilities/plate.generator';
import { CreateTaskDto } from './dto/create-task.dto';
import { ITask } from './interfaces/response-task.interface';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User) {
    const { name, description, status } = createTaskDto;
    const dateCreated = new Date().toISOString();
    const plate = PlateGenerator(name);
    const task = this.taskRepository.create({
      name: name,
      plate: plate,
      description: description,
      created: dateCreated,
      status: status,
      user: user,
    });
    await this.taskRepository.save(task);
    return task;
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    const response: ITask = {
      id: task.id,
      name: task.name,
      description: task.description,
      created: task.created,
      finished: task.finished,
      watched: task.watched,
      status: task.status,
      plate: task.plate,
    };
    return response;
  }
  async findByTerm(searchDto: SearchDto, user: User) {
    const entityName = 'Tasks';
    const { watched, search, status, created, finished } = searchDto;
    const queryRunner = this.dataSource.createQueryBuilder(
      Task,
      entityName,
    );
    queryRunner.where(`${entityName}.user = :user`, { user: user.id });
    if (watched) {
      queryRunner.andWhere(`${entityName}.watched = :watched`, {
        watched: watched,
      });
    }
    if (search) {
      queryRunner.andWhere(`(${entityName}.name like :name`, {
        name: `%${search}%`,
      });
      queryRunner.orWhere(`${entityName}.description like :description)`, {
        description: `%${search}%`,
      });
    }
    if (status) {
      queryRunner.andWhere(`${entityName}.status = :status`, {
        status: status,
      });
    }

    if (created) {
      const dateCreated = this._validateDates(created);
      queryRunner.andWhere(`${entityName}.created = :created`, {
        created: dateCreated,
      });
    }

    if (finished) {
      const dateFinished = await this._validateDates(finished);
      queryRunner.andWhere(`${entityName}.finished = :finished`, {
        finished: dateFinished,
      });
    }
    const getTask = await queryRunner.getMany();
    const response = this._transformResponse(getTask);
    return response;
  }

  async findAll(user: User) {
    const tasks = await this.taskRepository.find({
      order: { id: { direction: 'ASC' } },
      where: { user: Equal(user.id) },
    });
    const response = await this._transformResponse(tasks);
    return response;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { name, description, status, finished } = updateTaskDto;
    const task = await this.taskRepository.preload({
      id,
      name,
      description,
      status,
    });
    const trans = await this._startTransaction();
    try {
      if (finished) {
        task.finished = new Date().toISOString();
        task.status = Status.FINISHED;
      }
      await trans.manager.save(task);
      await trans.commitTransaction();
      await trans.release();
    } catch (error) {
      await trans.rollbackTransaction();
      await trans.release();
    }
  }

  async remove(id: number, user: User) {
    this._validateUserHierarchy(user);
    const task = await this.taskRepository.findOneBy({ id });
    await this.taskRepository.remove(task);
  }

  async watch(id: number) {
    const task = await this.taskRepository.preload({ id });
    const trans = await this._startTransaction();
    try {
      task.watched = true;
      await trans.manager.save(task);
      await trans.commitTransaction();
      await trans.release();
    } catch (error) {
      await trans.rollbackTransaction();
      await trans.release();
    }
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

  private async _transformResponse(tasksOrm: Task[]) {
    const tasksComplete = tasksOrm;
    const tasks = [];
    const total = tasksOrm.length;
    tasksComplete.forEach((task) => {
      const taskPlain: ITask = {
        id: task.id,
        name: task.name,
        description: task.description,
        created: task.created,
        finished: task.finished,
        watched: task.watched,
        status: task.status,
        plate: task.plate,
      };
      tasks.push(taskPlain);
    });
    return { tasks, total };
  }
  private async _validateUserHierarchy(user:User) {
    if (user.roles.includes('user')) {
      throw new UnauthorizedException('Users can not execute this action');
    }
  }
}
