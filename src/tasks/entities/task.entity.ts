import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from '../../common/enums/status.enum';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'Tasks' })
export class Task {
  @PrimaryGeneratedColumn({ name: 'Task_intId' })
  id: number;

  @Column({ name: 'Task_strPlate' })
  plate: string;

  @Column({ name: 'Task_strName' })
  name: string;

  @Column({ name: 'Task_strDescription' })
  description: string;

  @Column({ name: 'Task_dtmCreated', type: 'date' })
  created: string;

  @Column({ name: 'Task_dtmFinished', type: 'date', nullable: true })
  finished: string;

  @Column({
    name: 'Task_enumStatus',
    type: 'enum',
    enum: Status,
    default: Status.STARTED,
  })
  status: Status;

  @Column({ name: 'Task_boolWatched', default: false, type: 'bool' })
  watched: boolean;

  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  @JoinColumn({ name: 'User_uuidId' })
  user: User;
}
