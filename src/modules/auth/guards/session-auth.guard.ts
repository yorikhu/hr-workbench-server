import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserService } from '../../user/user.service';
import { UserStatus } from '../../user/entities/user.entity';
import type { AuthenticatedUser } from '../authenticated-user.interface';
import { invokeSessionAction } from '../utils/session';

/**
 * Session 鉴权守卫。
 *
 * @description
 * 用于保护需要登录才能访问的接口：根据请求 Cookie 中的会话 ID
 * 查找服务端会话，校验其中是否已写入登录用户（`session.user`），
 * 通过后将 {@link AuthenticatedUser} 注入 `req.user`，失败返回 401。
 *
 * 相比无状态 JWT，服务端 Session 可在每次请求时低成本重校验
 * 最新账号状态与角色：账号被停用或角色被回收即时生效，
 * 弥补滑动过期导致登录态长期有效的问题。
 */
@Injectable()
export class SessionAuthGuard implements CanActivate {
  /**
   * @param userService 用户服务，用于逐请求重校验账号状态与角色
   */
  constructor(private readonly userService: UserService) {}

  /**
   * @param context 执行上下文
   * @returns 已登录且账号有效返回 `true`
   * @throws {UnauthorizedException} 未登录、会话过期或账号不可用时抛出
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const cached = request.session?.user;
    if (!cached) {
      throw new UnauthorizedException('登录已过期，请重新登录');
    }

    // 重校验最新账号状态：不存在或已停用/锁定则销毁会话并要求重新登录
    const user = await this.userService.findOne(cached.userId);
    if (!user || user.status !== UserStatus.ACTIVE) {
      if (request.session) {
        await invokeSessionAction(request.session, 'destroy');
      }
      throw new UnauthorizedException('账号不可用或已被停用，请重新登录');
    }

    // 角色有变化时同步刷新会话快照（无变化不写回，保持 resave:false 生效）
    const roles = user.roles.map((r) => r.code);
    const rolesChanged =
      roles.length !== cached.roles.length ||
      roles.some((code) => !cached.roles.includes(code));
    if (request.session) {
      request.session.user = rolesChanged ? { ...cached, roles } : cached;
    }

    request.user = request.session?.user ?? cached;
    return true;
  }
}
