import { Role } from "../enums/role.enum";
import { UpdatePutUserDTO } from "../user/dto/update-put-user.dto";

export const UpdatePutUserDTOMock: UpdatePutUserDTO = {
    birthAt: "2000-01-01",
    email: "igor@email.com",
    name: "igor",
    password: "1234567i",
    role: Role.User
};
