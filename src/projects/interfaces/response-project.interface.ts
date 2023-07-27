import { Status } from '../../common/enums/status.enum';

export interface IProject {
  id: number;
  name: string;
  projectType: string;
  created: string;
  finished: string | null;
  updated: string | null;
  status: Status;
}
