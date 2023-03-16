import { Test, TestingModule } from "@nestjs/testing";
import { Prisma, User } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { ROLE } from "../users/constants";
import { UsersService } from "../users/users.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

const USERNAME = "mvp";

const NEW_USER = {
  username: USERNAME,
  password: "eve",
  role: ROLE.BUYER,
};

const ID = "1";

const userRecord = {
  id: ID,
  username: USERNAME,
  password: "eve",
  role: ROLE.BUYER,
} as unknown as Prisma.Prisma__UserClient<User>;

describe("AppController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, PrismaService],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    authService = app.get<AuthService>(AuthService);
  });

  describe("AppController", () => {
    it('should find and register"', async () => {
      const spyFind = jest
        .spyOn(authService, "findByUsername")
        .mockImplementation(() => null);
      const spyRegister = jest
        .spyOn(authService, "register")
        .mockImplementation(() => userRecord);

      const user = await authController.register(NEW_USER);
      expect(user.username).toBe(USERNAME);
      expect(spyFind).toHaveBeenCalled();
      expect(spyRegister).toHaveBeenCalled();
    });
  });
});
