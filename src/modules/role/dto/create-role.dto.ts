import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

/**
 * 创建角色入参。
 *
 * @description 用于 `POST /roles`。
 */
export class CreateRoleDto {
  /** 角色名称 */
  @ApiProperty({ example: 'HR 管理员', description: '角色名称' })
  @IsString()
  @Length(1, 64)
  name!: string;

  /** 角色编码 */
  @ApiProperty({ example: 'hr', description: '角色编码' })
  @IsString()
  @Length(1, 64)
  code!: string;

  /** 角色描述（可选） */
  @ApiProperty({
    required: false,
    example: '负责人员档案管理',
    description: '角色描述',
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  /** 是否内置角色（可选，默认 false） */
  @ApiProperty({ required: false, default: false, description: '是否内置角色' })
  @IsOptional()
  @IsBoolean()
  isBuiltIn?: boolean;
}
