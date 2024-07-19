import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrimsaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrimsaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService
    ) {}

    createToken(user: User) {
        return {
            accessToken: this.jwtService.sign(
                {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                {
                    expiresIn: "7 days",
                    subject: String(user.id),
                    issuer: "login",
                    audience: "users"
                }
            )
        };
    }

    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                audience: "users",
                issuer: "login"
            });

            return data;
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (error) {
            return false;
        }
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            throw new NotFoundException("Email e/ou senha incorretos");
        }

        if (!(await bcrypt.compare(password, user.password))) {
            throw new NotFoundException("Email e/ou senha incorretos");
        }

        return this.createToken(user);
    }
    async forget(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            throw new NotFoundException("Email está incorreto");
        }

        const token = this.jwtService.sign(
            {
                id: user.id
            },
            {
                expiresIn: "7 days",
                subject: String(user.id),
                issuer: "forget",
                audience: "users"
            }
        );

        await this.mailer.sendMail({
            subject: "Recuperar Senha",
            to: "teste@gmail.com",
            template: "forget",
            context: {
                name: user.name,
                token
            }
        });

        return true;
    }
    async reset(password: string, token: string) {
        try {
            const data: any = this.jwtService.verify(token, {
                issuer: "forget",
                audience: "users"
            });

            if (isNaN(Number(data.id))) {
                throw new BadRequestException("Token é inválido");
            }

            password = await bcrypt.hash(password, await bcrypt.genSalt());
            const user = await this.prisma.user.update({
                where: {
                    id: Number(data.id)
                },
                data: {
                    password
                }
            });

            return this.createToken(user);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async register(data: AuthRegisterDTO) {
        const user = await this.userService.create(data);

        return this.createToken(user);
    }
}
