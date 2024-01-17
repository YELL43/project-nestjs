import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { jwtConstants } from './constants';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userrepo: Repository<User>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      // If there's no Bearer token, you might want to handle it accordingly.
      return next();
    }
    const token = authorizationHeader.split(' ')[1];
    console.log(token);

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const user = await this.userrepo.findOne({
        where: {
          uuid: payload.uuid,
        },
      });
      console.log(user);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      next();
    } catch {
      throw new UnauthorizedException();
    }
  }
}
