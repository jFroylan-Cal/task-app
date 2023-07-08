import { Status } from '../../common/enums/status.enum';

export interface IResponseTaskDto {
  tasks: ITask[];
}

export interface ITask {
  id: number;
  name: string;
  description: string;
  created: string;
  finished: string | null;
  status: Status;
  watched: boolean;
  plate: string;
  user: IUser;
}

export interface IUser {
  id: string;
  userName: string;
  name: string;
  lastName: string;
}
