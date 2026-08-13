import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * 更新用户入参。
 *
 * @description
 * 继承自 {@link CreateUserDto} 但剔除 `username`（用户名通常不可改），
 * 所有字段可选，用于 `PATCH /users/:id`。
 */
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username'] as const),
) {}
