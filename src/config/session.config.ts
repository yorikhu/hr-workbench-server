import { Logger } from '@nestjs/common';
import type { SessionOptions } from 'express-session';

/**
 * 会话 Cookie 名称。
 *
 * @description 注销时用于清除 Cookie，同时暴露给 Swagger 文档做 Cookie 鉴权声明。
 */
export const SESSION_COOKIE_NAME = 'hr.sid';

/** 开发环境默认会话密钥，生产环境禁止使用 */
const DEV_SESSION_SECRET = 'dev-session-secret-change-me';

// 生产环境必须显式配置高强度 SESSION_SECRET，禁止静默回退到公开的默认密钥
if (
  process.env.NODE_ENV === 'production' &&
  (!process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET === DEV_SESSION_SECRET)
) {
  throw new Error(
    '生产环境必须在环境变量中配置高强度的 SESSION_SECRET（不允许使用默认开发密钥）',
  );
}

/**
 * 服务端会话（Session）配置。
 *
 * @description
 * 登录态保存在服务端，浏览器仅持有会话 Cookie（`httpOnly` + `strict`），
 * 适合中后台这类需要强制下线、即时回收权限的场景。
 * 所有取值均优先读取环境变量，在 `.env` 中按 {@link .env.example}
 * 配置即可覆盖默认值。
 *
 * 【生产环境注意】
 * 未配置 `store` 时使用内存存储（MemoryStore），仅适用于单实例开发环境；
 * 生产或多实例部署必须接入外部会话存储（如 `connect-redis` + Redis），
 * 否则重启即全员掉线、多实例无法共享会话且内存会持续增长。
 */
export const sessionConfig: SessionOptions = {
  /** 会话 Cookie 名称，避免暴露默认的 `connect.sid` */
  name: SESSION_COOKIE_NAME,

  /** 会话签名密钥（生产环境由上方启动校验保证已显式配置） */
  secret: process.env.SESSION_SECRET ?? DEV_SESSION_SECRET,

  /** 未变化的会话不重复写回存储 */
  resave: false,

  /** 未登录的请求不创建空会话，避免无效 Cookie */
  saveUninitialized: false,

  /** 滑动过期：每次请求自动续期 Cookie 与会话（账号状态由守卫逐请求重校验兜底） */
  rolling: true,

  cookie: {
    /** 禁止前端脚本读取，防 XSS 窃取 */
    httpOnly: true,

    /**
     * 严格同站策略，作为 Cookie 鉴权下的 CSRF 纵深防御：
     * 跨站请求（含顶级导航）一律不携带会话 Cookie。
     * 本服务为纯 API 后端，不依赖跨站导航携带登录态；
     * 若未来前端与 API 分属不同站点，需改为 `lax`/`none` 并引入 CSRF 令牌。
     */
    sameSite: 'strict',

    /**
     * 是否仅 HTTPS 传输：默认生产环境强制开启。
     * 内部工具经纯 HTTP 对外提供时可显式设置 SESSION_COOKIE_SECURE=false。
     */
    secure: process.env.SESSION_COOKIE_SECURE
      ? process.env.SESSION_COOKIE_SECURE === 'true'
      : process.env.NODE_ENV === 'production',

    /** 会话有效期（毫秒），默认 8 小时 */
    maxAge: (Number(process.env.SESSION_TTL) || 8 * 60 * 60) * 1000,
  },
};

if (process.env.NODE_ENV === 'production' && !sessionConfig.store) {
  new Logger('SessionConfig').warn(
    '未配置外部会话存储，当前使用内存存储（MemoryStore）：重启会导致所有用户掉线，且不支持多实例部署。生产环境请接入 Redis（connect-redis）等外部存储。',
  );
}
