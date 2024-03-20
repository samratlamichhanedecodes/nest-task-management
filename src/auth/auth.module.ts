import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule, getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource } from 'typeorm';
import { customUserRepositoryMethods } from 'src/auth/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: getRepositoryToken(User),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource){
        //override default repository for task with a custom one.
        return dataSource.getRepository(User).extend(customUserRepositoryMethods);
      }
    },
    AuthService
  ]
})
export class AuthModule {}
