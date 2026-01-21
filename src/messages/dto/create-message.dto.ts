import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  receiverId: number; // Gửi cho ai

  @IsNotEmpty()
  @IsString()
  content: string; // Nội dung là gì
}