import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { User } from "src/auth/user.entity";

export interface TaskRepository extends Repository<Task>{
    this: Repository <Task>;
    createTask(
        createTaskDto: CreateTaskDto,
        user: User,
    ): Promise <Task>;
    getTasks(filterDto: GetTasksFilterDto,
        user: User,
        ): Promise <Task[]>;
}

export const customTaskRepositoryMethods: Pick<
    TaskRepository,
    'createTask' | 'getTasks'
    > = {
        
        async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
            const {title, description} = createTaskDto;

            const task = new Task();
            task.title = title;
            task.description = description;
            task.status = TaskStatus.OPEN;
            task.user = user;
            await task.save();

            delete task.user;

            return task;

        },

        async getTasks(
            filterDto: GetTasksFilterDto, 
            user: User
        ): Promise<Task[]>{
            const {status, search} = filterDto;
            const query = this.createQueryBuilder('task');

            query.where('task.userId = :userId', {userId: user.id})

            if(status){
                query.andWhere('task.status = :status', {status})
            }

            if(search){
                query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`})
            }

            const tasks = await query.getMany();
            return tasks;

        }
    };