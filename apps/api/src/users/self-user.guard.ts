import { CanActivate, ExecutionContext,Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { User } from "@prisma/client";

import { SelfDecoratorParams } from "./self.decorator";

@Injectable()
export class SelfUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    let selfParams = this.reflector.get<SelfDecoratorParams>(
      "selfParams",
      context.getHandler()
    );
    if (!selfParams)
      selfParams = this.reflector.get<SelfDecoratorParams>(
        "selfParams",
        context.getClass()
      );

    if (!selfParams) return true;

    const userIDParam = selfParams.userId;

    if (!user) return false;
    if (request.params[userIDParam] === user.id) return true;
  }
}
