import { CacheModule, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { LoggerMiddleware } from '../globals/logger.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // CacheModule.register({
    //   // store: redisStore,
    //   // socket: {
    //   //   host: 'localhost',
    //   //   port: 6379,
    //   // },
    // }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
