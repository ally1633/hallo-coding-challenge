import { Test, TestingModule } from "@nestjs/testing";
// import { ROLE } from '../users/constants';
import { Prisma, User } from "@prisma/client";
import { ROLE } from "../users/constants";
import { UsersService } from "../users/users.service";

import { PrismaService } from "../prisma.service";
import { UsersModule } from "../users/users.module";
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
  role: "BUYER",
} as unknown as Prisma.Prisma__UserClient<User>;

describe("AuthService", () => {
  let userService: UsersService;
  let authService: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: { findUnique: jest.fn().mockResolvedValue(userRecord) },
          },
        },
        AuthService,
      ],
      imports: [UsersModule],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it("should be defined", async () => {
    expect(authService).toBeDefined();
  });

  it("should retrieve user by username", async () => {
    const user = await authService.findByUsername(USERNAME);

    expect(user.username).toBe(USERNAME);
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
