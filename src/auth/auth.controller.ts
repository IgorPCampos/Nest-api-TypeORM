import {
    BadRequestException,
    Body,
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UploadedFiles,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { AuthService } from "./auth.service";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { UserFilter } from "../decorators/user.decorator";
import { FileService } from "../file/file.service";
import { AuthGuard } from "../guards/auth.guard";
import { UserEntity } from "../user/entity/user.entity";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ) {}

    @Post("login")
    async login(@Body() { email, password }: AuthLoginDTO) {
        return this.authService.login(email, password);
    }

    @Post("register")
    async register(@Body() body: AuthRegisterDTO) {
        return this.authService.register(body);
    }

    @Post("forget")
    async forget(@Body() { email }: AuthForgetDTO) {
        return this.authService.forget(email);
    }

    @Post("reset")
    async reset(@Body() { password, token }: AuthResetDTO) {
        return this.authService.reset(password, token);
    }

    @UseGuards(AuthGuard)
    @Post("me")
    async me(@UserFilter() user: UserEntity) {
        //@UserFilter("email") para pegar só o email
        return user;
    }

    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(AuthGuard)
    @Post("file")
    async uploadFile(
        @UserFilter() user: UserEntity,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({
                        fileType: "image/jpeg"
                    }),
                    new MaxFileSizeValidator({
                        maxSize: 50000 //50KB
                    })
                ]
            })
        )
        photo: Express.Multer.File
    ) {
        const path = join(__dirname, "..", "..", "storage", "photos", `photos-${user.id}.png`);
        try {
            await this.fileService.upload(photo, path);
        } catch (error) {
            throw new BadRequestException(error);
        }

        return photo;
    }

    @UseInterceptors(FilesInterceptor("files"))
    @UseGuards(AuthGuard)
    @Post("files")
    async uploadFiles(@UserFilter() user, @UploadedFiles() files: Express.Multer.File[]) {
        return files;
    }

    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: "photo",
                maxCount: 1
            },
            {
                name: "documents",
                maxCount: 2
            }
        ])
    )
    @UseGuards(AuthGuard)
    @Post("files-fields")
    async uploadFilesFields(
        @UserFilter() user,
        @UploadedFiles() files: { photo: Express.Multer.File; documents: Express.Multer.File[] }
    ) {
        return files;
    }
}
