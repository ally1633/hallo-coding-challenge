import { SetMetadata } from "@nestjs/common";

import { ROLE } from "./constants";

export const Roles = (role: ROLE) => SetMetadata("role", role);
