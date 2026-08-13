import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT 载荷结构。
 */
export interface JwtPayload {
  /** 用户 ID */
  sub: number;
  /** 用户名 */
  username: string;
  /** 角色编码集合 */
  roles: string[];
}

/**
 * 认证后挂载到 `req.user` 的当前用户信息。
 */
export interface AuthenticatedUser {
  /** 用户 ID */
  userId: number;
  /** 用户名 */
  username: string;
  /** 角色编码集合 */
  roles: string[];
}

/**
 * JWT 策略。
 *
 * @description
 * 从 `Authorization: Bearer <token>` 提取并校验 JWT，
 * 解码后将 {@link AuthenticatedUser} 注入 `req.user`。
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * @param config 配置服务，读取 `JWT_SECRET` / `JWT_EXPIRES_IN`
   */
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev-secret-change-me',
    });
  }

  /**
   * Passport 回调：校验通过后将载荷转为 `req.user`。
   *
   * @param payload 解码后的 JWT 载荷
   * @returns 注入到 `req.user` 的当前用户对象
   */
  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
