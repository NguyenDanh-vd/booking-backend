// src/properties/dto/update-property.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';
import { IsOptional } from 'class-validator';

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  // Thêm trường này để nhận danh sách link ảnh cũ từ Frontend
  @IsOptional()
  existingImages?: string[] | string; 
}