import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 所有实体的公共基类。
 *
 * @description
 * 统一维护主键 `id` 与审计字段 `createdAt` / `updatedAt`，
 * 各业务实体（User、Role 等）通过继承复用，避免重复定义。
 */
export abstract class BaseEntity {
  /**
   * 主键，自增整型。
   * @type {number}
   */
  @PrimaryGeneratedColumn({ comment: '主键 ID' })
  id!: number;

  /**
   * 创建时间，由数据库自动写入，应用层不修改。
   * @type {Date}
   */
  @CreateDateColumn({ comment: '创建时间' })
  createdAt!: Date;

  /**
   * 最近一次更新时间，由数据库自动维护。
   * @type {Date}
   */
  @UpdateDateColumn({ comment: '更新时间' })
  updatedAt!: Date;
}
