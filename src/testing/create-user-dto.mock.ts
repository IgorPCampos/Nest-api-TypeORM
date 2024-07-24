import { Role } from "../enums/role.enum";
import { CreateUserDTO } from "../user/dto/create-user.dto";

export const CreateUserDTOMock: CreateUserDTO = {
    birthAt: "2000-01-01",
    email: "igor@email.com",
    name: "igor",
    password: "1234567i",
    role: Role.User
};
