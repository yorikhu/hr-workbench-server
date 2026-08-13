import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

/**
 * 创建用户入参。
 *
 * @description 用于 `POST /users`，校验账号、密码与基础资料。
 */
export class CreateUserDto {
  /** 登录用户名 */
  @ApiProperty({ example: 'zhangsan', description: '登录用户名' })
  @IsString()
  @Length(3, 64)
  username!: string;

  /** 登录密码（明文，服务端会哈希后存储） */
  @ApiProperty({ example: 'P@ssw0rd', description: '登录明文密码' })
  @IsString()
  @Length(6, 64)
  password!: string;

  /** 邮箱（可选） */
  @ApiProperty({
    required: false,
    example: 'zhangsan@example.com',
    description: '邮箱',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  /** 显示昵称（可选） */
  @ApiProperty({ required: false, example: '张三', description: '显示昵称' })
  @IsOptional()
  @IsString()
  @Length(1, 64)
  displayName?: string;

  /** 账号状态（可选，默认启用） */
  @ApiProperty({ required: false, enum: UserStatus, description: '账号状态' })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
