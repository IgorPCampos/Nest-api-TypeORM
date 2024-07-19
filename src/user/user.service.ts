import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrimsaService } from "src/prisma/prisma.service";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrimsaService) {}

    async create(data: CreateUserDTO) {
        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
        return this.prisma.user.create({
            data
        });
    }

    async list() {
        return this.prisma.user.findMany();
    }

    async listOne(id: number) {
        await this.exists(id);

        return this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async update(id: number, data: UpdatePutUserDTO) {
        await this.exists(id);
        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
        return this.prisma.user.update({
            data,
            where: {
                id
            }
        });
    }

    async updatePartial(id: number, data: UpdatePatchUserDTO) {
        await this.exists(id);
        data.password = await bcrypt.hash(data.password, await bcrypt.genSalt());
        return this.prisma.user.update({
            data,
            where: {
                id
            }
        });
    }

    async delete(id: number) {
        await this.exists(id);

        return this.prisma.user.delete({
            where: {
                id
            }
        });
    }

    async exists(id: number) {
        if (
            !(await this.prisma.user.count({
                where: {
                    id
                }
            }))
        ) {
            throw new NotFoundException(`O usuário ${id} não existe`);
        }
    }
}
