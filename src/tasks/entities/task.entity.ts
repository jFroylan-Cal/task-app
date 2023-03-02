import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TaskStatus } from 'src/common/enums/task-status.enum';

@Entity({ name: 'tbl_Tasks' })
export class Task {
  @PrimaryGeneratedColumn({ name: 'Task_intId' })
  id: number;
  @Column({ name: 'Task_strPlate' })
  plate: string;
  @Column({ name: 'Tasks_strName' })
  name: string;
  @Column({ name: 'Task_strDescription' })
  description: string;
  @Column({ name: 'Task_dtmCreated' })
  created: string;
  @Column({ name: 'Task_dtmFinished' })
  finished: string;
  @Column({ name: 'Task_enumStatus' })
  status: TaskStatus;
}
