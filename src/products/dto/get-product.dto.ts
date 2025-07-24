import { IsNumberString, IsOptional } from "class-validator";

export class GetProductQueryDto {
  @IsOptional()
  @IsNumberString({}, {message: "Category must be a number"})
  category_id: number

  @IsOptional()
  @IsNumberString({}, { message: "Take must be a number" })
  take: number 

  @IsOptional()
  @IsNumberString({}, { message: "Skip must be a number" })
  skip: number 
}