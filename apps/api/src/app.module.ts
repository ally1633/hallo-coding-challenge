import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { AuthService } from "./auth/auth.service";
import { PrismaService } from "./prisma.service";
import { ProductsModule } from "./products/products.module";
import { ProductsService } from "./products/products.service";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductsModule,
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        ttl: 10,
        limit: 10,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AuthService,
    PrismaService,
    ProductsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
