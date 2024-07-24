import { Role } from "../enums/role.enum";
import { UserEntity } from "../user/entity/user.entity";

export const userEntityList: UserEntity[] = [
    {
        id: 1,
        birthAt: new Date("2000-01-01"),
        email: "igor@email.com",
        name: "igor",
        password: "$2b$10$4Lli26hcX71EOdp4ai9MjuGcYNbH5ittZlqTCcr1RPWjwusqpAWfq",
        role: Role.Admin,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        birthAt: new Date("2001-01-01"),
        email: "igor1@email.com",
        name: "igor1",
        password: "$2b$10$4Lli26hcX71EOdp4ai9MjuGcYNbH5ittZlqTCcr1RPWjwusqpAWfq",
        role: Role.User,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
