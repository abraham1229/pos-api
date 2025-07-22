import { IsString, IsNotEmpty } from "class-validator"
  
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({message: "Invalid name"})
  name: string
}
