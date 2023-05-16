import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../../common/enums/status.enum';
@Entity({ name: 'Projects' })
export class Project {
  @PrimaryGeneratedColumn({ name: 'Project_intId' })
  id: number;

  @Column({ name: 'Project_strName' })
  name: string;

  @Column({ name: 'Project_dtmCreated', type: 'date' })
  created: string;

  @Column({ name: 'Project_strType' })
  projectType: string;

  @Column({ name: 'Project_dtmFinished', type: 'date', nullable: true })
  finished: string;

  @Column({
    name: 'Project_enumStatus',
    type: 'enum',
    enum: Status,
    default: Status.STARTED,
  })
  status: Status;
}
