import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { UserModule } from '../user/user.module';

/**
 * 鉴权领域模块。
 *
 * @description
 * 组装登录板块所需的 Passport（local，仅用于登录时的凭证校验）
 * 与用户服务，提供基于 Cookie + 服务端 Session 的登录、注销与受保护接口。
 *
 * 【数据库占位】导入的 {@link UserModule} 依赖 TypeORM 全局连接，
 * 在数据库就绪前相关方法无法实际执行，但模块装配已完成。
 */
@Module({
  imports: [UserModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
