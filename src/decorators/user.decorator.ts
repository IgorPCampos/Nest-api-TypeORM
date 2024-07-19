import { createParamDecorator, ExecutionContext, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";

export const UserFilter = createParamDecorator(
    (filter: keyof Omit<User, "id" | "password">, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (request.user) {
            return filter ? request.user[filter] : request.user;
        } else {
            throw new NotFoundException("Usuário não encontrado no request");
        }
    }
);
