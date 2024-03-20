import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

export interface UserRepository extends Repository<User>{
    this: Repository <User>;
    signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>;
}

export const customUserRepositoryMethods: Pick<
    UserRepository,
    'signUp'
    > = {

        async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
            const { username, password } = authCredentialsDto;

            const user = new User();
            user.username = username;
            user.password = password;
            await user.save()
        }
    }