import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as redisStore from 'cache-manager-redis-store';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { LoggerMiddleware } from './globals/logger.middleware';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './globals/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10h' },
    }),
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   socket: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    // CacheModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     const redisHost = config.get<string>('REDIS_HOST');
    //     const redisPort = Number(config.get<string>('REDIS_PORT'));
    //     return {
    //       isGlobal: true,
    //       store: redisStore,
    //       socket: {
    //         host: redisHost,
    //         port: redisPort,
    //       },
    //     };
    //   },
    // }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<string>('DB_PORT')),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [User],
          synchronize: true,
        };
      },
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
