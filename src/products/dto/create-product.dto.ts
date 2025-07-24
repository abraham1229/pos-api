import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateProductDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({message: 'Invalid name'})
  name: string

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({maxDecimalPlaces: 2}, {message: 'Invalid price'})
  price: number

  @IsNotEmpty({ message: 'Inventory is required' })
  @IsNumber({maxDecimalPlaces: 0}, {message: 'Invalid inventory'})
  inventory: number

  @IsNotEmpty({ message: 'Category is required' })
  @IsInt({message: 'Invalid category ID'})
  categoryId: number
}
