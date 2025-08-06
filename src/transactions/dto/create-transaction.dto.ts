import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class TransactionContentsDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsInt({ message: 'Invalid product' })
  productId: number;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsInt({ message: 'Invalid quantity' }) // Validate quantity too
  quantity: number;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber({}, { message: 'Invalid price' })
  price: number;
}

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Total is required' })
  @IsNumber({}, { message: 'Invalid total' })
  total: number

  @IsOptional()
  coupon: string

  @IsArray()
  @ArrayNotEmpty({ message: 'Contents is required' })
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[]
}