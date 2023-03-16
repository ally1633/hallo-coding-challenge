import { SetMetadata } from "@nestjs/common";

export interface SelfDecoratorParams {
  userId: string;
}

export const Self = (params: SelfDecoratorParams | string) =>
  SetMetadata(
    "selfParams",
    typeof params == "string" ? { userId: params } : params
  );
