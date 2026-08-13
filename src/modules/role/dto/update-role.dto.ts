import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';

/**
 * 更新角色入参。
 *
 * @description
 * 继承自 {@link CreateRoleDto} 但剔除 `code`（编码通常不可改），
 * 所有字段可选，用于 `PATCH /roles/:id`。
 */
export class UpdateRoleDto extends PartialType(
  OmitType(CreateRoleDto, ['code'] as const),
) {}
