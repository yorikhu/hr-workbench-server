import type { Session } from 'express-session';

/**
 * 将 Session 的回调式操作包装为 Promise。
 *
 * @description 统一 `destroy`（注销）与 `regenerate`（登录时轮换会话 ID）
 * 的异步包装与错误归一化，供鉴权服务与守卫复用。
 *
 * @param session 当前请求的会话
 * @param action 需要执行的操作
 */
export function invokeSessionAction(
  session: Session,
  action: 'destroy' | 'regenerate',
): Promise<void> {
  return new Promise((resolve, reject) => {
    session[action]((err) => {
      if (err) {
        reject(
          err instanceof Error
            ? err
            : new Error(`会话${action === 'destroy' ? '销毁' : '重建'}失败`),
        );
        return;
      }
      resolve();
    });
  });
}
