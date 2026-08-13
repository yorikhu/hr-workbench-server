import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * 应用启动入口。
 *
 * @description 创建 Nest 应用，装配全局参数校验管道与 Swagger 文档，
 * 监听端口由环境变量 `PORT` 控制，默认 3000。
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // 全局参数校验：自动剥离未声明属性、按 DTO 类型转换、统一抛出 400
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('HR Workbench API')
    .setDescription('HR Workbench 接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
