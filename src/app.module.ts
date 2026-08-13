import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './config/database.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { UserModule } from './modules/user/user.module';
// import { RoleModule } from './modules/role/role.module';
// import { AuthModule } from './modules/auth/auth.module';

/**
 * 应用根模块。
 *
 * @description
 * 当前仅装配配置加载与示例控制器/服务。
 *
 * 【数据库占位】PostgreSQL 实例尚未创建，登录板块（用户/角色/鉴权）
 * 的领域模块已实现，待数据库就绪后取消下方注释即可接入：
 * 1. `TypeOrmModule.forRoot(databaseConfig)` 建立连接；
 * 2. 注册 `UserModule` / `RoleModule` / `AuthModule`。
 */
@Module({
  imports: [
    // 全局加载 .env 配置，供各模块通过 ConfigService 读取
    ConfigModule.forRoot({ isGlobal: true }),

    // [数据库占位] 取消注释以启用 PostgreSQL 连接
    // TypeOrmModule.forRoot(databaseConfig),

    // [数据库占位] 取消注释以注册登录板块领域模块
    // UserModule,
    // RoleModule,
    // AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
