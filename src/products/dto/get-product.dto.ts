import { IsNumberString, IsOptional } from "class-validator";

export class GetProductQueryDto {
  @IsOptional()
  @IsNumberString({}, {message: "Category must be a number"})
  category_id?: number
}