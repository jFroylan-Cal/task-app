import { TaskStatus } from "../../common/enums/task-status.enum";

export class CreateTaskDto {
    name: string;
    description: string;
    status: TaskStatus
}
