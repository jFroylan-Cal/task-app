import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchDto } from 'src/common/dto/search.dto';
import { PlateGenerator } from 'src/common/utilities/plate.generator';
import { Like, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  create(createTaskDto: CreateTaskDto) {
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
    this.taskRepository.save(task);
    return task;
  }

  findOne(id: number) {
    return this.taskRepository.findBy({ id });
  }

  findTask(searchDto: SearchDto) {
    const { name, description } = searchDto;
    if (name) {
      const task = this.taskRepository.find({
        where: {
          name: Like(`%${name}%`),
        },
      });
      return task;
    }

    if (description) {
      const task = this.taskRepository.find({
        where: {
          name: Like(`%${description}%`),
        },
      });
      return task;
    }
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
