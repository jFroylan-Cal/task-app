import { Status } from '../../common/enums/status.enum';

export interface ITask {
  id: number;
  name: string;
  description: string;
  created: string;
  finished: string | null;
  status: Status;
  watched: boolean;
  plate: string;
}
