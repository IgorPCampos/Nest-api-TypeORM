import { Test, TestingModule } from "@nestjs/testing";
import { userEntityList } from "../testing/user-entity-list.mock";
import { UserController } from "./user.controller";
import { userServiceMock } from "../testing/user-service.mock";
import { AuthGuard } from "../guards/auth.guard";
import { guardMock } from "../testing/guard.mock";
import { RoleGuard } from "../guards/role.guard";
import { UserService } from "./user.service";
import { CreateUserDTOMock } from "../testing/create-user-dto.mock";
import { UpdatePatchUserDTOMock } from "../testing/update-patch-user-dto.mock";
import { UpdatePutUserDTOMock } from "../testing/update-put-user-dto.mock";

describe("UserCOntroller", () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [userServiceMock]
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .overrideGuard(RoleGuard)
            .useValue(guardMock)
            .compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    it("validate the definition", () => {
        expect(userController).toBeDefined();
        expect(userService).toBeDefined();
    });

    describe("Testing the guards", () => {
        it("guards are applied", () => {
            const guards = Reflect.getMetadata("__guards__", UserController);

            expect(guards.length).toEqual(2);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
            expect(new guards[1]()).toBeInstanceOf(RoleGuard);
        });
    });

    describe("Create", () => {
        it("create method", async () => {
            const result = await userController.create(CreateUserDTOMock);

            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe("Read", () => {
        it("list method", async () => {
            const result = await userController.list();

            expect(result).toEqual(userEntityList);
        });

        it("show method", async () => {
            const result = await userController.show(1);

            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe("Update", () => {
        it("update method", async () => {
            const result = await userService.update(1, UpdatePutUserDTOMock);

            expect(result).toEqual(userEntityList[0]);
        });

        it("updatePartial method", async () => {
            const result = await userService.updatePartial(1, UpdatePatchUserDTOMock);

            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe("Delete", () => {
        it("delete method", async () => {
            const result = await userService.delete(1);

            expect(result).toEqual(true);
        });
    });
});
