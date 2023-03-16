import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";

import { CreateUserDto } from "../users/dto/create-user.dto";
import { LoginUserDto } from "../users/dto/login-user.dto";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { LoggedInGuard } from "./logged-in.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    await this.authService.insertSession({
      user: req.user,
      sessionId: req.sessionID,
    });
    return req.user;
  }

  @Post("logout")
  @UseGuards(LoggedInGuard)
  async logout(@Request() req) {
    await this.authService.logout({
      userId: req.user.id,
    });
    req.session.destroy();
    return req.session;
  }

  @Get("me")
  @UseGuards(LoggedInGuard)
  async me(@Request() req) {
    return req.user;
  }

  @Post("logout/all")
  @ApiBody({ type: LoginUserDto })
  async logoutAll(@Body() credentials) {
    const user = await this.authService.validateUser(
      credentials.username,
      credentials.password,
      true
    );

    if (user) {
      await this.authService.logout({
        userId: user.id,
      });
    }

    return { logout: true };
  }

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.findByUsername(createUserDto.username);

    if (!user) {
      return this.authService.register(createUserDto);
    } else {
      throw new UnauthorizedException();
    }
  }
}
