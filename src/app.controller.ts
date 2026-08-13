import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '欢迎语' })
  @ApiResponse({ status: 200, description: '返回 Hello World', type: String })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
