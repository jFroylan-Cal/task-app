import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchDto } from 'src/common/dto/search.dto';
import { PlateGenerator } from 'src/common/utilities/plate.generator';
import { DataSource, Like, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly dataSourse: DataSource,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
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
    });
    await this.taskRepository.save(task);
    return task;
  }

  findOne(id: number) {
    return this.taskRepository.findBy({ id });
  }

  async findTask(searchDto: SearchDto) {
    const { name, description } = searchDto;
    if (name) {
      const task = await this.taskRepository.find({
        where: {
          name: Like(`%${name}%`),
        },
      });
      return task;
    }

    if (description) {
      const task = await this.taskRepository.find({
        where: {
          name: Like(`%${description}%`),
        },
      });
      return task;
    }
  }

  async findAllTasks() {
    return this.taskRepository.findAndCount();
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const { ...toUpdate } = updateTaskDto;
    const task = await this.taskRepository.preload({
      id,
      ...toUpdate,
    });
    const trans = await this.startTransaction();
    try {  
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

  async startTransaction() {
    const queryRunner = this.dataSourse.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}
