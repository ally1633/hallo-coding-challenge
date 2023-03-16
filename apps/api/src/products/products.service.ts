import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";

import { PrismaService } from "../prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { getChangeArray } from "./utils";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto, user: User) {
    return this.prisma.product.create({
      data: { ...createProductDto, sellerId: user.id },
    });
  }
  findAll() {
    return this.prisma.product.findMany({ take: 100 });
  }

  findOne(id: string) {
    return this.prisma.product.findFirst({ where: { id } });
  }

  async update(updateProductDto: UpdateProductDto, user: User) {
    const currentProduct = await this.findOne(updateProductDto.id);

    if (currentProduct.sellerId !== user.id) {
      throw new HttpException(`Not your PEPSI.`, HttpStatus.UNAUTHORIZED);
    }

    return this.prisma.product.update({
      data: updateProductDto,
      where: { id: updateProductDto.id },
    });
  }

  async remove(id: string, user: User) {
    const currentProduct = await this.findOne(id);

    if (currentProduct.sellerId !== user.id) {
      throw new HttpException(`Not your PEPSI.`, HttpStatus.UNAUTHORIZED);
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async buy(id: string, amount: number, user: User) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new HttpException(
        `Product ${id} does not exits`,
        HttpStatus.BAD_REQUEST
      );
    }

    const totalPrice = product.cost * amount;
    if (product.amountAvailable < amount) {
      throw new HttpException(
        `PEPSI machine does not have ${amount} of this product. Only ${product.amountAvailable} left.`,
        HttpStatus.BAD_REQUEST
      );
    }

    if (totalPrice > user.deposit) {
      throw new HttpException("Not enough rupees.", HttpStatus.BAD_REQUEST);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        amountAvailable: product.amountAvailable - amount,
      },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        deposit: user.deposit - totalPrice,
      },
    });

    return {
      totalSpent: totalPrice,
      product: updatedProduct,
      change: getChangeArray(totalPrice, user.deposit),
    };
  }
}
