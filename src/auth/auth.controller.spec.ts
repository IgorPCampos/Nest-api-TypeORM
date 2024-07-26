import { Test, TestingModule } from "@nestjs/testing";
import { accessToken } from "../testing/access-token.mock";
import { AuthRegisterDTOMock } from "../testing/auth-register-dto.mock";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "../guards/auth.guard";
import { guardMock } from "../testing/guard.mock";
import { authServiceMock } from "../testing/auth-service.mock";
import { fileServiceMock } from "../testing/file-service.mock";
import { authForgetDTOMock } from "../testing/auth-forget-dto.mock";
import { authLoginDTOMock } from "../testing/auth-login-dto.mock";
import { authResetDTOMock } from "../testing/auth-reset-dto.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { getPhoto } from "../testing/get-photo.mock";

describe("AuthController", () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [authServiceMock, fileServiceMock]
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .compile();

        authController = module.get<AuthController>(AuthController);
    });

    it("validate the definition", () => {
        expect(authController).toBeDefined();
    });

    describe("Authentication", () => {
        it("login method", async () => {
            const result = await authController.login(authLoginDTOMock);

            expect(result).toEqual({ accessToken });
        });

        it("forget method", async () => {
            const result = await authController.forget(authForgetDTOMock);

            expect(result).toEqual({ success: true });
        });

        it("reset method", async () => {
            const result = await authController.reset(authResetDTOMock);

            expect(result).toEqual({ accessToken });
        });

        it("register method", async () => {
            const result = await authController.register(AuthRegisterDTOMock);

            expect(result).toEqual({ accessToken });
        });
    });

    describe("Authenticatedd rotes", () => {
        it("me method", async () => {
            const result = await authController.me(userEntityList[0]);

            expect(result).toEqual(userEntityList[0]);
        });

        it("uploadFile method", async () => {
            const photo = await getPhoto();
            const result = await authController.uploadFile(userEntityList[0], photo);

            expect(result).toEqual(photo);
        });
    });
});
