import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT 鉴权守卫。
 *
 * @description
 * 用于保护需要登录才能访问的接口：从 `Authorization: Bearer <token>`
 * 解析并校验 JWT，通过后将 {@link AuthenticatedUser} 注入 `req.user`，
 * 失败返回 401。
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
