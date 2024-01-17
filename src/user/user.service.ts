import {
  CACHE_MANAGER,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { redisClient } from '../globals/Redis';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../globals/constants';

@Injectable()
export class UserService {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User) private userrepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    try {
      const user = await this.authenticateUser(username, password);

      if (!user) {
        throw new NotFoundException(
          404,
          'User not found or invalid credentials',
        );
      }
      const payload = { uuid: user.uuid };
      const token = await this.jwtService.signAsync(payload);

      // Generate JWT token
      return { token, user };
      // return {
      //   access_token: await this.jwtService.signAsync(payload),
      // };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
  async authenticateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userrepo.findOne({
      where: {
        userName: username,
        passWord: password,
      },
    });

    return user || null;
  }

  async create(req: CreateUserDto) {
    try {
      const user: User = this.userrepo.create({ ...req });
      return this.userrepo.save(user);
    } catch (error) {
      throw new Error(`Unable to fetch records: ${error.message}`);
    }
  }

  async findAll() {
    try {
      await redisClient.connect();
      const cachedValue = await redisClient.get('key_test');
      if (cachedValue) {
        console.log('From cache');
        return JSON.parse(cachedValue);
      }

      const users = await this.userrepo.find();
      await redisClient.set('key_test', JSON.stringify(users));
      console.log('From API');
      return users;
    } catch (error) {
      throw new Error(`Unable to fetch records: ${error.message}`);
    } finally {
      await redisClient.disconnect();
    }
  }

  // async findAll() {
  //   try {
  //     await redisClient.connect();
  //     const cachedValue = await redisClient.get('key_test');
  //     if (cachedValue) {
  //       console.log('Form cache');
  //       return cachedValue;
  //     }
  //     const users = await this.userrepo.find();
  //     await redisClient.set('key_test', JSON.stringify(users));
  //     console.log('Form API');
  //     return users;
  //   } catch (error) {
  //     throw new Error(`Unable to fetch records: ${error.message}`);
  //   }
  //   // try {
  //   //   const cacheKey = 'my_test_key';
  //   //   const cachedValue = await this.cacheManager.get(cacheKey);
  //   //   if (cachedValue) {
  //   //     console.log('Form cache');
  //   //     return cachedValue;
  //   //   }
  //   //   const users = await this.userrepo.find();
  //   //   await this.cacheManager.set(cacheKey, JSON.stringify(users));
  //   //   console.log('Form API');
  //   //   return users;
  //   // } catch (error) {
  //   //   throw new Error(`Unable to fetch records: ${error.message}`);
  //   // }
  // }

  async findOne(id: number) {
    try {
      await redisClient.connect();
      const cachedUser = await redisClient.get(`user:${id}`);
      if (cachedUser) {
        console.log('From cache');
        return JSON.parse(cachedUser);
      }

      const query: User = await this.userrepo.findOne({
        where: {
          idUser: id,
        },
      });

      if (!query) {
        throw new NotFoundException(404, 'Not Found Data');
      }

      await redisClient.set(`user:${id}`, JSON.stringify(query));
      console.log('From API');
      return query;
    } finally {
      await redisClient.disconnect();
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
