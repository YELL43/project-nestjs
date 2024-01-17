import { CacheTTL, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerMiddleware } from './globals/logger.middleware';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }
}
