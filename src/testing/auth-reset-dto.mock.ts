import { AuthResetDTO } from "../auth/dto/auth-reset.dto";
import { resetToken } from "./reset-token.mock";

export const authResetDTOMock: AuthResetDTO = {
    password: "654321",
    token: resetToken
};
