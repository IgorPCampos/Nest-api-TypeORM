import { Test, TestingModule } from "@nestjs/testing";
import { userRepositoryMock } from "../testing/user-repository.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthService } from "./auth.service";
import { jwtServiceMock } from "../testing/jwt-service.mock";
import { UserEntity } from "../user/entity/user.entity";
import { userServiceMock } from "../testing/user-service.mock";
import { mailerServiceMock } from "../testing/mailer-service.mock";
import { accessToken } from "../testing/access-token.mock";
import { jwtPayload } from "../testing/jwt-payload.mock";
import { resetToken } from "../testing/reset-token.mock";
import { AuthRegisterDTOMock } from "../testing/auth-register-dto.mock";

describe("AuthService", () => {
    let authService: AuthService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, userRepositoryMock, jwtServiceMock, userServiceMock, mailerServiceMock]
        }).compile();

        authService = module.get<AuthService>(AuthService);
        userRepository = module.get(getRepositoryToken(UserEntity));
    });

    it("validate the definition", () => {
        expect(authService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe("Token", () => {
        it("createToken method", async () => {
            const result = authService.createToken(userEntityList[0]);

            expect(result).toEqual({
                accessToken
            });
        });

        it("checkToken method", async () => {
            const result = authService.checkToken(accessToken);

            expect(result).toEqual(jwtPayload);
        });

        it("isValidToken method", async () => {
            const result = authService.isValidToken(accessToken);

            expect(result).toEqual(true);
        });
    });

    describe("Authentication", () => {
        it("login method", async () => {
            const result = await authService.login("igor@email.com", "123456i");

            expect(result).toEqual({ accessToken });
        });

        it("forget method", async () => {
            const result = await authService.forget("igor@email.com");

            expect(result).toEqual({ success: true });
        });

        it("reset method", async () => {
            const result = await authService.reset("123456i", resetToken);

            expect(result).toEqual({ accessToken });
        });

        it("register method", async () => {
            const result = await authService.register(AuthRegisterDTOMock);

            expect(result).toEqual({ accessToken });
        });
    });
});
