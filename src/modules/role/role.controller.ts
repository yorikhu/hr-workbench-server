import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * 角色管理接口。
 *
 * @description 提供角色的增删改查，路由前缀 `/roles`。
 */
@ApiTags('role')
@Controller('roles')
export class RoleController {
  /**
   * @param roleService 角色领域服务
   */
  constructor(private readonly roleService: RoleService) {}

  /**
   * 创建角色。
   * @param dto 创建入参
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建角色' })
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  /**
   * 查询角色列表。
   */
  @Get()
  @ApiOperation({ summary: '查询角色列表' })
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * 查询单个角色。
   * @param id 角色 ID
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个角色' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOne(id);
  }

  /**
   * 更新角色。
   * @param id 角色 ID
   * @param dto 更新入参
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新角色' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  /**
   * 删除角色。
   * @param id 角色 ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除角色' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }
}
