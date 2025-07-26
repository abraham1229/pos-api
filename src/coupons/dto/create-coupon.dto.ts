import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator"

export class CreateCouponDto {

  @IsNotEmpty({ message: 'Invalid coupon name' })
  name: string

  @IsNotEmpty({ message: 'Invalid coupon percentage' })
  @IsInt({ message: 'Percentage must be an integer' })
  @Max(100, {message: 'Maximum value is 100'}) 
  @Min(1, {message: 'Minumum value is 1'}) 
  percentage: number

  @IsNotEmpty({ message: 'Invalid coupon date' })
  @IsDateString({}, {message: 'Invalid coupon date'})
  expirationDate: Date
}
