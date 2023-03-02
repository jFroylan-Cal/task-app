import { TaskStatus } from "../../common/enums/task-status.enum";

export class CreateTaskDto {
    name: string;
    description: string;
    created: string;
    finished: string;
    status: TaskStatus
}
