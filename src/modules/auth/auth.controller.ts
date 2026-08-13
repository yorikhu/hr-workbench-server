import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedUser } from './strategies/jwt.strategy';

/**
 * 鉴权接口。
 *
 * @description 提供登录与当前用户信息查询，路由前缀 `/auth`。
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  /**
   * @param authService 鉴权服务
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * 账号密码登录。
   *
   * @description 通过 {@link LocalAuthGuard} 完成凭证校验后签发 JWT。
   * @param _dto 登录入参（由 LocalStrategy 消费）
   * @param req 请求对象，`req.user` 为已认证用户
   * @returns 登录凭证
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '账号密码登录' })
  login(@Body() _dto: LoginDto, @Req() req: { user: Omit<User, 'password'> }) {
    return this.authService.login(req.user);
  }

  /**
   * 获取当前登录用户信息。
   *
   * @description 受 {@link JwtAuthGuard} 保护，需携带有效 JWT。
   * @param req 请求对象，`req.user` 为解析后的当前用户
   * @returns 当前用户信息
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前登录用户信息' })
  profile(@Req() req: { user: AuthenticatedUser }): AuthenticatedUser {
    return req.user;
  }
}
