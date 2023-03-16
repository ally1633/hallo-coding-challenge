import { IsString, MinLength } from "class-validator";

export class LoginUserDto {
  @IsString()
  @MinLength(5)
  public username: string;

  @IsString()
  @MinLength(5)
  public password: string;
}
