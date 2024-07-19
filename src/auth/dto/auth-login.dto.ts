import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class AuthLoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    @IsStrongPassword({
        minLength: 6,
        minSymbols: 0,
        minUppercase: 0
    })
    password: string;
}
