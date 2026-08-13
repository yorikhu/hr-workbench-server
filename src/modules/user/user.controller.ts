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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * 用户管理接口。
 *
 * @description 提供用户的增删改查，路由前缀 `/users`。
 */
@ApiTags('user')
@Controller('users')
export class UserController {
  /**
   * @param userService 用户领域服务
   */
  constructor(private readonly userService: UserService) {}

  /**
   * 创建用户。
   * @param dto 创建入参
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建用户' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  /**
   * 查询用户列表。
   */
  @Get()
  @ApiOperation({ summary: '查询用户列表' })
  findAll() {
    return this.userService.findAll();
  }

  /**
   * 查询单个用户。
   * @param id 用户 ID
   */
  @Get(':id')
  @ApiOperation({ summary: '查询单个用户' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  /**
   * 更新用户。
   * @param id 用户 ID
   * @param dto 更新入参
   */
  @Patch(':id')
  @ApiOperation({ summary: '更新用户' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  /**
   * 删除用户。
   * @param id 用户 ID
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
