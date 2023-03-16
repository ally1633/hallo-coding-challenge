import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { PrismaService } from "../prisma.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthSerializer } from "./auth-serializer.provider";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, AuthSerializer, PrismaService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
