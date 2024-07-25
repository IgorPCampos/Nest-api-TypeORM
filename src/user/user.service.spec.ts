import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { userRepositoryMock } from "../testing/user-repository.mock";
import { userEntityList } from "../testing/user-entity-list.mock";
import { CreateUserDTOMock } from "../testing/create-user-dto.mock";
import { Repository } from "typeorm";
import { UserEntity } from "./entity/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UpdatePutUserDTOMock } from "../testing/update-put-user-dto.mock";
import { UpdatePatchUserDTOMock } from "../testing/update-patch-user-dto.mock";

describe("UserService", () => {
    let userService: UserService;
    let userRepository: Repository<UserEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserService, userRepositoryMock]
        }).compile();
        userService = module.get<UserService>(UserService);
        userRepository = module.get(getRepositoryToken(UserEntity));
    });

    it("validate the definition", () => {
        expect(userService).toBeDefined();
        expect(userRepository).toBeDefined();
    });

    describe("Create", () => {
        it("create method", async () => {
            jest.spyOn(userRepository, "exists").mockResolvedValueOnce(false);
            const result = await userService.create(CreateUserDTOMock);

            expect(result).toEqual(userEntityList[0]);
        });
    });

    describe("Read", () => {
        it("list method", async () => {
            const result = await userService.list();

            expect(result).toEqual(userEntityList);
        });

        it("show method", async () => {
            const result = await userService.show(1);

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
