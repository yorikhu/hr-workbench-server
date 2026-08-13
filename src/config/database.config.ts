import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * PostgreSQL 数据源连接配置。
 *
 * @description
 * 【数据库占位】目标数据库实例尚未创建，这里仅提供默认占位参数，
 * 便于后续建库后直接接入。所有取值均优先读取环境变量，
 * 在 `.env` 中按 {@link .env.example} 配置即可覆盖默认值。
 *
 * 建库参考（psql）：
 * ```sql
 * CREATE DATABASE hr_workbench ENCODING 'UTF8';
 * ```
 *
 * 启用步骤：
 * 1. 创建数据库与对应账号；
 * 2. 在 `.env` 中填写 `DB_HOST` / `DB_USERNAME` / `DB_PASSWORD` 等；
 * 3. 在 `app.module.ts` 中取消 `TypeOrmModule.forRoot(databaseConfig)` 注释。
 */
export const databaseConfig: TypeOrmModuleOptions = {
  /** 数据库类型，固定使用 PostgreSQL */
  type: 'postgres',

  /** 主机地址，默认本机占位 */
  host: process.env.DB_HOST ?? 'localhost',

  /** 端口，PostgreSQL 默认 5432 */
  port: Number(process.env.DB_PORT ?? 5432),

  /** 连接用户名（占位，按实际环境填写） */
  username: process.env.DB_USERNAME ?? 'postgres',

  /** 连接密码（占位，按实际环境填写） */
  password: process.env.DB_PASSWORD ?? 'postgres',

  /** 目标数据库名（建库后需与实际一致） */
  database: process.env.DB_DATABASE ?? 'hr_workbench',

  /**
   * 自动加载各模块通过 `TypeOrmModule.forFeature()` 注册的实体，
   * 无需在此手动维护实体清单。
   */
  autoLoadEntities: true,

  /**
   * 非生产环境开启表结构同步（便于开发期建表）。
   * 生产环境务必关闭，改用迁移（migration）管理结构。
   */
  synchronize: process.env.NODE_ENV !== 'production',

  /** 非生产环境打印 SQL 日志，便于调试 */
  logging: process.env.NODE_ENV !== 'production',
};
