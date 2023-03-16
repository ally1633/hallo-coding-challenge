import { Test, TestingModule } from "@nestjs/testing";
import { Prisma, User } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { ROLE } from "./constants";
import { UsersModule } from "./users.module";
import { UsersService } from "./users.service";

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
  role: "BUYER",
} as unknown as Prisma.Prisma__UserClient<User>;

describe("UserService", () => {
  let prisma: PrismaService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
      imports: [UsersModule],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", async () => {
    expect(userService).toBeDefined();
  });

  it("should retrieve user by username", async () => {
    const spyUserService = jest
      .spyOn(userService, "findOne")
      .mockImplementation(() => userRecord);
    const user = await userService.findOne(USERNAME);

    expect(user.username).toBe(USERNAME);
    expect(spyUserService).toHaveBeenCalledWith(USERNAME);
  });

  it("should retrieve user by username", async () => {
    const spy = jest
      .spyOn(prisma.user, "create")
      .mockImplementation(() => userRecord);

    const user = await userService.create(NEW_USER);

    expect(spy).toHaveBeenCalledWith({ data: { ...NEW_USER, deposit: 0 } });
    expect(user.username).toBe(USERNAME);
    expect(user.id).toBe(ID);
  });
});
