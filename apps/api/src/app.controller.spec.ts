import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Product, User } from "database";
import * as httpMocks from "node-mocks-http";

import { AppController } from "./app.controller";
import { PrismaService } from "./prisma.service";
import { CreateProductDto } from "./products/dto/create-product.dto";
import { ProductsService } from "./products/products.service";
import { ROLE } from "./users/constants";
import { CreateUserDto } from "./users/dto/create-user.dto";
import { UsersService } from "./users/users.service";

const newBuyer: CreateUserDto = {
  username: "bob",
  password: "13378",
  role: ROLE.BUYER,
};

const newSeller: CreateUserDto = {
  username: "alice",
  password: "tring1337",
  role: ROLE.SELLER,
};

const newProduct1: CreateProductDto = {
  productName: "Whisker",
  productImage: "https://images.freeimages.com/images/large-previews/738/mammal-1614175.jpg",
  expiresAt: new Date("2024-03-07 12:00:00"),
  amountAvailable: 11,
  cost: 250,
};

const newProduct2: CreateProductDto = {
  productName: "Broom",
  productImage:"https://images.freeimages.com/images/large-previews/1fc/yardrake-1633702.png",
  amountAvailable: 90,
  expiresAt: new Date("2024-03-07 12:00:00"),
  cost: 23,
};

const STARTING_DEPOSIT = 5002;
const ADDED_DEPOSIT = 100;

describe("AppController", () => {
  let appController: AppController;
  let prisma: PrismaService;
  let buyer: User;
  let seller: User;
  let product1: Product;
  let product2: Product;
  let mockRequest: RequestWithUser;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = app.get<PrismaService>(PrismaService);
    buyer = await prisma.user.create({
      data: { ...newBuyer, deposit: STARTING_DEPOSIT },
    });
    seller = await prisma.user.create({
      data: { ...newSeller, deposit: 1002 },
    });

    product1 = await prisma.product.create({
      data: { ...newProduct1, sellerId: seller.id },
    });

    product2 = await prisma.product.create({
      data: { ...newProduct2, sellerId: seller.id },
    });

    mockRequest = httpMocks.createRequest() as never as RequestWithUser;
    mockRequest.user = buyer;
  });

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [UsersService, PrismaService, ProductsService],
    }).compile();

    appController = app.get<AppController>(AppController);
    const updatedUser = await prisma.user.findUnique({
      where: { id: buyer.id },
    });
    mockRequest.user = updatedUser;
  });

  type RequestWithUser = Request & { user: User };
  describe("root", () => {
    it("should /deposit 100", async () => {
      const response = await appController.deposit(
        { deposit: ADDED_DEPOSIT },
        mockRequest
      );

      expect(response.deposit).toBe(STARTING_DEPOSIT + ADDED_DEPOSIT);
    });

    it("should /buy 100", async () => {
      const AMOUNT = 3;
      const response = await appController.buy(
        { productId: product2.id, amount: AMOUNT },
        mockRequest
      );

      expect(response.totalSpent).toBe(product2.cost * AMOUNT);
      expect(response.product.amountAvailable).toBe(
        newProduct2.amountAvailable - AMOUNT
      );
    });

    it("/buy should throw don't have enough products", async () => {
      const AMOUNT = 300;
      await expect(
        appController.buy(
          { productId: product1.id, amount: AMOUNT },
          mockRequest
        )
      ).rejects.toThrowError(HttpException);
    });

    it("/reset should reset deposit to 0", async () => {
      const response = await appController.reset(mockRequest);

      expect(response.deposit).toBe(0);
    });

    it("/buy should throw not enough money", async () => {
      const AMOUNT = 10;
      await expect(
        appController.buy(
          { productId: product1.id, amount: AMOUNT },
          mockRequest
        )
      ).rejects.toThrowError(HttpException);
    });
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteProducts = prisma.product.deleteMany();
    const deleteSessions = prisma.sessions.deleteMany();

    await prisma.$transaction([deleteProducts, deleteUsers, deleteSessions]);
    await prisma.$disconnect();
  });
});
