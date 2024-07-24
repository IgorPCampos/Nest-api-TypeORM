import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { AuthGuard } from "../guards/auth.guard";
import { ParamId } from "../decorators/param-id.decorator";
import { Roles } from "../decorators/roles.decorator";
import { Role } from "../enums/role.enum";
import { RoleGuard } from "../guards/role.guard";
import { LogInterceptor } from "../interceptors/log.interceptor";

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor) //Coloca o interceptor em todas as rotas
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Roles(Role.Admin)
    @Get()
    async list() {
        return this.userService.list();
    }

    @Get(":id")
    async listOne(@ParamId() id: number) {
        return this.userService.show(id);
    }

    @UseInterceptors(LogInterceptor) //Coloca o interceptor somente nessa rota
    @Roles(Role.Admin)
    @Post()
    async create(@Body() data: CreateUserDTO) {
        return this.userService.create(data);
    }

    @Roles(Role.Admin)
    @Patch(":id")
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number) {
        return this.userService.updatePartial(id, data);
    }

    @Roles(Role.Admin)
    @Put(":id")
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number) {
        return this.userService.update(id, data);
    }

    @Roles(Role.Admin)
    @Delete(":id")
    async delete(@ParamId() id: number) {
        return this.userService.delete(id);
    }
}
