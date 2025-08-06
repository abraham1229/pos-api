import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto {
  @IsNotEmpty({ message: 'Coupon name is required' })
  coupon_name: string
}