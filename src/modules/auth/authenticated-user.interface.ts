/**
 * 认证通过后挂载到 `req.user` 与 Session 中的当前用户信息。
 */
export interface AuthenticatedUser {
  /** 用户 ID */
  userId: number;
  /** 用户名 */
  username: string;
  /** 角色编码集合 */
  roles: string[];
}
