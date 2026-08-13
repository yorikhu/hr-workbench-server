import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * 本地登录守卫。
 *
 * @description
 * 挂载到登录接口，触发 {@link LocalStrategy} 完成账号密码校验，
 * 校验通过后将用户对象写入 `req.user`，失败返回 401。
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
