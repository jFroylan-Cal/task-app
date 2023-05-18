import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { SearchDto } from '../common/dto/search.dto';
import { PlateGenerator } from '../common/utilities/plate.generator';
import { CreateTaskDto } from './dto/create-task.dto';
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
    let plate: string;
    let dateCreated: string;
    dateCreated = new Date().toISOString();
    plate = PlateGenerator(name);
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

  findOne(id: number) {
    return this.taskRepository.findBy({ id });
  }

  async findTask(searchDto: SearchDto) {
    const { search, created, finished, status, watched } = searchDto;
    if (search) {
      const task = await this.taskRepository.findAndCount({
        where: [
          {
            name: Like(`%${search}%`),
          },
          {
            description: Like(`%${search}%`),
          },
        ],
      });
      return task;
    }

    if (created) {
      const task = await this.taskRepository.findAndCount({
        where: {
          created: created,
        },
      });
      return task;
    }

    if (finished) {
      const task = await this.taskRepository.findAndCount({
        where: {
          finished: finished,
        },
      });
      return task;
    }

    if (status) {
      const task = await this.taskRepository.findAndCount({
        where: {
          status: status,
        },
      });
      return task;
    }

    if (watched) {
      const task = await this.taskRepository.findAndCount({
        where: {
          watched: true,
        },
      });
      return task;
    }
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
      }
      await trans.manager.save(task);
      await trans.commitTransaction();
      await trans.release();
    } catch (error) {
      await trans.rollbackTransaction();
      await trans.release();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
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
