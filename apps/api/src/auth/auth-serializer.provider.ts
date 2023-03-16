import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "@prisma/client";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(user: User, done: (err: Error, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(
    payload: { username: string },
    done: (err: Error, user: Omit<User, "password">) => void
  ) {
    const user = await this.authService.findByUsername(payload.username);

    done(null, user);
  }
}
