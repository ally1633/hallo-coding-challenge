import { IsInt, Max, Min } from "class-validator";

export class BuyProductDto {
  public productId: string;

  @IsInt()
  @Min(1)
  @Max(9999999)
  public amount: number;
}
