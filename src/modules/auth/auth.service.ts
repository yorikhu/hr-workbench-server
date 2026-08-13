import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User, UserStatus } from '../user/entities/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';

/**
 * 登录后返回的凭证。
 */
export interface LoginResult {
  /** 访问令牌 */
  access_token: string;
  /** 用户名 */
  username: string;
  /** 角色编码集合 */
  roles: string[];
}

/**
 * 鉴权领域服务。
 *
 * @description
 * 负责账号密码校验与签发 JWT，是登录板块的核心。
 *
 * 【数据库占位】`validateUser` 依赖 `UserService`（进而依赖 TypeORM 仓储），
 * 待数据库就绪后即可直接运行。
 */
@Injectable()
export class AuthService {
  /**
   * @param userService 用户服务，用于查询账号与凭证
   * @param jwtService JWT 服务，用于签发令牌
   * @param config 配置服务，读取令牌过期时间等
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

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
   * 为已认证用户签发 JWT。
   *
   * @param user 校验通过的用户对象
   * @returns 登录凭证 {@link LoginResult}
   */
  async login(
    user: Pick<User, 'id' | 'username'> & { roles?: { code: string }[] },
  ): Promise<LoginResult> {
    const roles = (user.roles ?? []).map((r) => r.code);
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      roles,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
      roles,
    };
  }
}
