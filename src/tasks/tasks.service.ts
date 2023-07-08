import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { SearchDto } from '../common/dto/search.dto';
import { Status } from '../common/enums/status.enum';
import { PlateGenerator } from '../common/utilities/plate.generator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ITask } from './dto/response-task.dto';

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
      user: {
        id: task.user.id,
        userName: task.user.userName,
        name: task.user.name,
        lastName: task.user.lastName,
      },
    };
    return response;
  }
  async findByTerm(search: SearchDto, user: User) {
    const task = await this.taskRepository.findAndCount();
    return task;
  }

  async findAll(user: User) {
    const tasks = await this.taskRepository.findAndCount({
      order: { id: { direction: 'ASC' } },
      where: { user: Equal(user.id) },
    });
    return tasks;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { name, description, status, finished } = updateTaskDto;
    const task = await this.taskRepository.preload({
      id,
      name,
      description,
      status,
    });
    const trans = await this.startTransaction();
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

  async remove(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    await this.taskRepository.remove(task);
  }

  async watch(id: number) {
    const task = await this.taskRepository.preload({ id });
    const trans = await this.startTransaction();
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

  async startTransaction() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
