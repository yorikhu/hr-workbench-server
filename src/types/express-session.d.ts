import type { AuthenticatedUser } from '../modules/auth/authenticated-user.interface';

/**
 * 扩展 express-session 类型：在会话中持久化当前登录用户。
 *
 * @description 同时合并到 {@link Session}（类）与 `SessionData`，
 * 无论以哪种类型引用会话，都可通过 `session.user` 类型安全地读写登录态。
 */
declare module 'express-session' {
  interface Session {
    /** 登录后写入的当前用户信息 */
    user?: AuthenticatedUser;
  }

  interface SessionData {
    /** 登录后写入的当前用户信息 */
    user?: AuthenticatedUser;
  }
}
