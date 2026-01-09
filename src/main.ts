import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
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

  await app.listen(3000);
}
bootstrap();