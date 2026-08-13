import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * 用户领域服务。
 *
 * @description
 * 封装 `users` 表的增删改查与密码哈希逻辑，供 {@link UserController} 与
 * 鉴权模块（AuthService）调用。
 *
 * 【数据库占位】依赖 TypeORM 仓储；待 `app.module.ts` 启用
 * `TypeOrmModule.forRoot` 后，本服务的所有方法即可直接运行。
 */
@Injectable()
export class UserService {
  /** bcrypt 加密轮数，值越大越安全、越耗时 */
  private static readonly BCRYPT_ROUNDS = 10;

  /**
   * @param userRepository 用户实体仓储，由 TypeORM 注入
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 创建用户。
   *
   * @param dto 创建入参
   * @returns 持久化后的用户（不含密码密文）
   */
  async create(dto: CreateUserDto): Promise<User> {
    const entity = this.userRepository.create({
      ...dto,
      password: await bcrypt.hash(dto.password, UserService.BCRYPT_ROUNDS),
    });
    return this.userRepository.save(entity);
  }

  /**
   * 分页查询用户列表（不含密码）。
   *
   * @returns 用户集合
   */
  findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: { roles: true },
    });
  }

  /**
   * 按主键查询用户。
   *
   * @param id 用户 ID
   * @returns 用户实体或 `null`
   */
  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  /**
   * 按用户名查询用户（含密码密文，供登录校验使用）。
   *
   * @param username 登录用户名
   * @returns 用户实体（含 password）或 `null`
   */
  findByUsername(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.username = :username', { username })
      .getOne();
  }

  /**
   * 更新用户。
   *
   * @param id 用户 ID
   * @param dto 更新入参（若含 password 则重新哈希）
   * @returns 更新后的用户或 `null`（用户不存在）
   */
  async update(id: number, dto: UpdateUserDto): Promise<User | null> {
    const payload: UpdateUserDto & { password?: string } = { ...dto };
    if (dto.password) {
      payload.password = await bcrypt.hash(
        dto.password,
        UserService.BCRYPT_ROUNDS,
      );
    }
    await this.userRepository.update(id, payload);
    return this.findOne(id);
  }

  /**
   * 删除用户。
   *
   * @param id 用户 ID
   */
  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
