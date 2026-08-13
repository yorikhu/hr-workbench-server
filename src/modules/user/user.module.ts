import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

/**
 * 用户领域模块。
 *
 * @description 注册 `User` 实体与控制器/服务，并对外导出 `UserService`
 * 供鉴权模块（AuthModule）复用。
 *
 * 【数据库占位】`TypeOrmModule.forFeature` 依赖全局 `TypeOrmModule.forRoot`，
 * 在数据库就绪前不会真正建立仓储，但代码已就绪。
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
