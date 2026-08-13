import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../role/entities/role.entity';

/**
 * 用户账号状态枚举。
 */
export enum UserStatus {
  /** 启用 */
  ACTIVE = 'active',
  /** 停用 */
  DISABLED = 'disabled',
  /** 锁定（如连续登录失败） */
  LOCKED = 'locked',
}

/**
 * 用户实体。
 *
 * @description
 * 映射到 PostgreSQL 的 `users` 表，存储登录账号、凭证与基础资料，
 * 并通过多对多关系关联所属 {@link Role 角色}。
 */
@Entity('users')
@Index('idx_users_username', ['username'], { unique: true })
export class User extends BaseEntity {
  /** 登录用户名，全局唯一 */
  @ApiProperty({ example: 'zhangsan', description: '登录用户名' })
  @Column({ length: 64, unique: true, comment: '登录用户名' })
  username!: string;

  /**
   * 登录密码（密文）。
   * @description 仅存储经 bcrypt 哈希后的密文，禁止明文落库。
   */
  @ApiHideProperty()
  @Column({ length: 128, select: false, comment: '密码密文(bcrypt)' })
  password!: string;

  /** 邮箱，唯一且可为空 */
  @ApiProperty({ example: 'zhangsan@example.com', description: '邮箱' })
  @Column({ length: 128, nullable: true, comment: '邮箱' })
  email!: string | null;

  /** 显示昵称 */
  @ApiProperty({ example: '张三', description: '显示昵称' })
  @Column({ length: 64, nullable: true, comment: '显示昵称' })
  displayName!: string | null;

  /** 账号状态，见 {@link UserStatus} */
  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: '账号状态',
  })
  @Column({
    type: 'varchar',
    length: 16,
    default: UserStatus.ACTIVE,
    comment: '账号状态',
  })
  status!: UserStatus;

  /**
   * 用户拥有的角色集合。
   * @description 多对多关系，通过中间表 `user_roles` 维护。
   */
  @ApiProperty({ type: () => [Role], description: '所属角色' })
  @ManyToMany(() => Role, (role) => role.users, { cascade: false })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles!: Role[];
}
