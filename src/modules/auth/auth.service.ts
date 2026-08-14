import { Injectable } from '@nestjs/common';
import type { Session } from 'express-session';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User, UserStatus } from '../user/entities/user.entity';
import { invokeSessionAction } from './utils/session';

/**
 * 登录成功后返回的用户信息。
 */
export interface LoginResult {
  /** 用户名 */
  username: string;
  /** 角色编码集合 */
  roles: string[];
}

/**
 * 鉴权领域服务。
 *
 * @description
 * 负责账号密码校验与 Session 生命周期管理（写入/销毁），
 * 是登录板块的核心。登录态保存在服务端会话中，
 * 浏览器仅持有会话 Cookie，无需保存任何令牌。
 *
 * 【数据库占位】`validateUser` 依赖 `UserService`（进而依赖 TypeORM 仓储），
 * 待数据库就绪后即可直接运行。
 */
@Injectable()
export class AuthService {
  /**
   * @param userService 用户服务，用于查询账号与凭证
   */
  constructor(private readonly userService: UserService) {}

  /**
   * 校验用户名密码。
   *
   * @param username 用户名
   * @param password 明文密码
   * @returns 校验通过返回不含密码的用户对象，否则返回 `null`
   */
  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByUsername(username);
    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    // 解构出密码密文用于比对，剩余字段即为对外返回的安全用户对象
    const { password: hashedPassword, ...safe } = user;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return null;
    }

    return safe;
  }

  /**
   * 将已认证用户写入 Session。
   *
   * @description 写入后由 express-session 在响应时通过 `Set-Cookie`
   * 下发会话 Cookie，后续请求凭 Cookie 关联服务端会话。
   * @param user 校验通过的用户对象
   * @param session 当前请求的会话
   * @returns 当前用户信息 {@link LoginResult}
   */
  async login(
    user: Pick<User, 'id' | 'username'> & { roles?: { code: string }[] },
    session: Session,
  ): Promise<LoginResult> {
    // 登录即轮换会话 ID（重建会话），防止会话固定攻击：
    // 登录前被植入的旧会话 ID 在认证完成后即刻失效
    await invokeSessionAction(session, 'regenerate');

    const roles = (user.roles ?? []).map((r) => r.code);
    session.user = {
      userId: user.id,
      username: user.username,
      roles,
    };
    return { username: user.username, roles };
  }

  /**
   * 注销登录：销毁服务端会话。
   *
   * @description 会话销毁后，浏览器残留的 Cookie 即失效。
   * @param session 当前请求的会话，未初始化会话时跳过
   */
  async logout(session: Session | undefined): Promise<void> {
    if (!session) {
      return;
    }
    await invokeSessionAction(session, 'destroy');
  }
}
