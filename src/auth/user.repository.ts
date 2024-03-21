import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

export interface UserRepository extends Repository<User>{
    this: Repository <User>;
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>;
    validateUserPassword(authCredentialsDto: AuthCredentialsDto);
}

export const customUserRepositoryMethods: Pick<
    UserRepository,
    'signUp' | 'validateUserPassword'
    > = {

        async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
            const { username, password } = authCredentialsDto;

            const salt = await bcrypt.genSalt();

            const user = new User();
            user.username = username;
            user.password = await bcrypt.hash(password, salt);
            user.salt = salt;
            try{
                await user.save()
            }catch(error){
                if(error.code === '23505'){ //duplicate username
                    throw new ConflictException('Username already exists.');
                }else{
                    throw new InternalServerErrorException();
                }
            }
        },

        async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
            const {username, password} = authCredentialsDto;
            const user = await this.findOne({where: {username}});

            if(user && await user.validatePassword(password)){
                return user.username;
            }else{
                return null;
            }
        }
    }