import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

/**
 * 角色领域模块。
 *
 * @description 注册 `Role` 实体与控制器/服务，并对外导出 `RoleService`
 * 供鉴权模块（AuthModule）按编码查询角色。
 *
 * 【数据库占位】`TypeOrmModule.forFeature` 依赖全局 `TypeOrmModule.forRoot`，
 * 在数据库就绪前不会真正建立仓储，但代码已就绪。
 */
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
