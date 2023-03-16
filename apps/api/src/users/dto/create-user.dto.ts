import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";
import {
  PasswordValidation,
  PasswordValidationRequirement,
} from "class-validator-password-check";

import { ROLE } from "../constants";

const passwordRequirement: PasswordValidationRequirement = {
  mustContainLowerLetter: true,
  mustContainNumber: true,
  mustContainSpecialCharacter: true,
  mustContainUpperLetter: true,
};

export class CreateUserDto {
  @IsString()
  @MinLength(5)
  public username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(64)
  @Validate(PasswordValidation, [passwordRequirement])
  public password: string;

  @IsNotEmpty()
  @IsEnum(ROLE)
  public role: ROLE;
}
