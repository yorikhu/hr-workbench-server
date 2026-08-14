import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import { AppModule } from './app.module';
import { SESSION_COOKIE_NAME, sessionConfig } from './config/session.config';

/**
 * 应用启动入口。
 *
 * @description 创建 Nest 应用，装配 Session 中间件、全局参数校验管道
 * 与 Swagger 文档，监听端口由环境变量 `PORT` 控制，默认 3000。
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 生产环境默认部署在反向代理（Nginx/网关）之后，信任代理层：
  // 使 req.ip / req.protocol 等基于 X-Forwarded-* 头正确解析
  app.set('trust proxy', 1);

  // 服务端会话：登录态存储在服务端，浏览器仅持有会话 Cookie
  app.use(session(sessionConfig));

  // 全局参数校验：自动剥离未声明属性、按 DTO 类型转换、统一抛出 400
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('HR Workbench API')
    .setDescription('HR Workbench 接口文档')
    .setVersion('1.0')
    .addCookieAuth(SESSION_COOKIE_NAME)
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
