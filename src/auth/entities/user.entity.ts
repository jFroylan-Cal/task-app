import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'User_strEmail', type: 'text', unique: true })
  email: string;

  @Column({ name: 'User_strPassword', type: 'text', select: false })
  password: string;

  @Column({ name: 'User_strUsername', type: 'text' })
  userName: string;

  @Column({ name: 'User_strName', type: 'text' })
  name: string;

  @Column({ name: 'User_strLastName', type: 'text' })
  lastName: string;

  @Column({ name: 'User_BoolStatus', type: 'bool', default: true })
  isActive: boolean;

  @Column({ name: 'User_strRol', type: 'text', array: true, default: ['user'] })
  roles: string[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
