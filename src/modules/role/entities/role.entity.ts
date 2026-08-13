import { Column, Entity, Index, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';

/**
 * 角色实体。
 *
 * @description
 * 映射到 PostgreSQL 的 `roles` 表，定义权限角色（如 `admin`、`hr`），
 * 与 {@link User} 构成多对多关系。
 */
@Entity('roles')
@Index('idx_roles_code', ['code'], { unique: true })
export class Role extends BaseEntity {
  /** 角色名称（展示用） */
  @ApiProperty({ example: 'HR 管理员', description: '角色名称' })
  @Column({ length: 64, comment: '角色名称' })
  name!: string;

  /** 角色编码，全局唯一，程序内鉴权引用 */
  @ApiProperty({ example: 'hr', description: '角色编码' })
  @Column({ length: 64, unique: true, comment: '角色编码' })
  code!: string;

  /** 角色描述（可选） */
  @ApiProperty({
    required: false,
    example: '负责人员档案管理',
    description: '角色描述',
  })
  @Column({ length: 255, nullable: true, comment: '角色描述' })
  description!: string | null;

  /** 是否为内置角色（内置角色不可删除） */
  @ApiProperty({ example: false, description: '是否内置角色' })
  @Column({ default: false, comment: '是否内置角色' })
  isBuiltIn!: boolean;

  /**
   * 拥有该角色的用户集合（反向关系，由 User 一侧维护中间表）。
   */
  @ApiProperty({ type: () => [User], description: '拥有该角色的用户' })
  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];
}
