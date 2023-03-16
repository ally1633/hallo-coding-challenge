import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { ROLE } from "./constants";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireRole = this.reflector.getAllAndOverride<ROLE>("role", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requireRole) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const hasRole = requireRole === user?.role;

    if (!hasRole) {
      throw new HttpException(
        `Unauthorized. Requires a ${requireRole}`,
        HttpStatus.UNAUTHORIZED
      );
    }

    return true;
  }
}
