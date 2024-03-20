import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { customTaskRepositoryMethods } from './task.repository';
import { Task } from './task.entity';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
  ],
  controllers: [TasksController],
  providers: [
    {
      provide: getRepositoryToken(Task),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource){
        //override default repository for task with a custom one.
        return dataSource.getRepository(Task).extend(customTaskRepositoryMethods);
      }
    },
    TasksService
  ]
})
export class TasksModule {}
