import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Tự động loại bỏ các trường không có trong DTO (Bảo mật)
    transform: true, // Tự động chuyển đổi kiểu dữ liệu (VD: "123" -> 123)
    transformOptions: {
      enableImplicitConversion: true, // Hỗ trợ chuyển đổi ngầm định cho FormData
    },
  }));
  
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // CẤU HÌNH SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('Danh sách API cho ứng dụng đặt phòng')
    .setVersion('1.0')
    .addBearerAuth() // Cho phép nhập Token ngay trên web docs
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Truy cập tại /api
  // ------------------
  app.enableCors();
  
  await app.listen(3000);
}
bootstrap();