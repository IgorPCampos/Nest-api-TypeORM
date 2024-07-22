import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";
import { UserEntity } from "src/user/entity/user.entity";

export const UserFilter = createParamDecorator(
    (filter: keyof Omit<UserEntity, "id" | "password">, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (request.user) {
            return filter ? request.user[filter] : request.user;
        } else {
            throw new NotFoundException("Usuário não encontrado no request");
        }
    }
);
