import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import type { Session } from 'express-session';
import type { User } from '../user/entities/user.entity';
import { SESSION_COOKIE_NAME } from '../../config/session.config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionAuthGuard } from './guards/session-auth.guard';
import type { AuthenticatedUser } from './authenticated-user.interface';

/**
 * 鉴权接口。
 *
 * @description 提供登录、注销与当前用户信息查询，路由前缀 `/auth`。
 * 登录态基于 Cookie + 服务端 Session 维护。
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
   * @description 通过 {@link LocalAuthGuard} 完成凭证校验后，
   * 将用户信息写入服务端 Session，并以 `Set-Cookie` 下发会话 Cookie。
   * @param _dto 登录入参（由 LocalStrategy 消费）
   * @param req 请求对象，`req.user` 为已认证用户
   * @returns 当前用户信息
   */
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: '账号密码登录' })
  login(
    @Body() _dto: LoginDto,
    @Req() req: { user: Omit<User, 'password'>; session: Session },
  ) {
    return this.authService.login(req.user, req.session);
  }

  /**
   * 注销登录。
   *
   * @description 销毁服务端会话并清除浏览器中的会话 Cookie。
   * @param req 请求对象
   * @param res 响应对象，用于清除 Cookie
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '注销登录' })
  async logout(
    @Req() req: { session?: Session },
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(req.session);
    res.clearCookie(SESSION_COOKIE_NAME);
  }

  /**
   * 获取当前登录用户信息。
   *
   * @description 受 {@link SessionAuthGuard} 保护，需携带有效会话 Cookie。
   * @param req 请求对象，`req.user` 为会话中的当前用户
   * @returns 当前用户信息
   */
  @Get('profile')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: '获取当前登录用户信息' })
  profile(@Req() req: { user: AuthenticatedUser }): AuthenticatedUser {
    return req.user;
  }
}
