import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * 角色领域服务。
 *
 * @description 封装 `roles` 表的增删改查与内置角色保护逻辑。
 *
 * 【数据库占位】依赖 TypeORM 仓储；待 `app.module.ts` 启用
 * `TypeOrmModule.forRoot` 后，本服务的所有方法即可直接运行。
 */
@Injectable()
export class RoleService {
  /**
   * @param roleRepository 角色实体仓储，由 TypeORM 注入
   */
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 创建角色。
   * @param dto 创建入参
   */
  create(dto: CreateRoleDto): Promise<Role> {
    const entity = this.roleRepository.create(dto);
    return this.roleRepository.save(entity);
  }

  /**
   * 查询全部角色。
   */
  findAll(): Promise<Role[]> {
    return this.roleRepository.find({ order: { id: 'ASC' } });
  }

  /**
   * 按主键查询角色。
   * @param id 角色 ID
   */
  findOne(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { id } });
  }

  /**
   * 按编码查询角色。
   * @param code 角色编码
   */
  findByCode(code: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { code } });
  }

  /**
   * 更新角色。
   * @param id 角色 ID
   * @param dto 更新入参
   */
  async update(id: number, dto: UpdateRoleDto): Promise<Role | null> {
    await this.roleRepository.update(id, dto);
    return this.findOne(id);
  }

  /**
   * 删除角色。
   *
   * @description 内置角色（`isBuiltIn = true`）禁止删除。
   * @param id 角色 ID
   */
  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
