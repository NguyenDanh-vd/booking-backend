import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsNumber()
  propertyId: number;
}