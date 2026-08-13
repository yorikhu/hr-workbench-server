import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import type { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

/**
 * 本地（账号密码）登录策略。
 *
 * @description
 * 用于 `POST /auth/login`，从请求体读取 `username` / `password`，
 * 委托 {@link AuthService.validateUser} 校验凭证。
 * 校验通过后将用户对象挂载到 `req.user`。
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  /**
   * @param authService 鉴权服务
   */
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'username', passwordField: 'password' });
  }

  /**
   * Passport 回调：校验用户名密码。
   *
   * @param username 用户名
   * @param password 明文密码
   * @returns 校验通过后的用户对象（不含密码）
   * @throws {UnauthorizedException} 凭证无效或账号不可用时抛出
   */
  async validate(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return user;
  }
}
