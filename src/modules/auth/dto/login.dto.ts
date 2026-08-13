import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * 登录入参。
 *
 * @description 用于 `POST /auth/login`，校验用户名与密码。
 */
export class LoginDto {
  /** 登录用户名 */
  @ApiProperty({ example: 'zhangsan', description: '登录用户名' })
  @IsString()
  @Length(3, 64)
  username!: string;

  /** 登录密码（明文） */
  @ApiProperty({ example: 'P@ssw0rd', description: '登录密码' })
  @IsString()
  @Length(6, 64)
  password!: string;
}
