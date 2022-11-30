import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { compare, hash } from '@twitr/api/utils/crypto';
import { RefreshTokenData, UserConfig } from './user.interfaces';
import { sign } from 'jsonwebtoken';
import { RedisService } from '@twitr/api/utils/redis';
import { TOKEN_CACHE } from '@twitr/api/user/constants';
import { randomBytes } from 'crypto';
import { TokenResponse } from '@twitr/api/user/data-transfer-objects';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('USER_OPTIONS') private options: UserConfig,
    private redisService: RedisService
  ) {}

  public getUserByHandle(handle: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      handle,
    });
  }

  public async createUser(
    handle: string,
    password: string
  ): Promise<TokenResponse> {
    const existingUser: User | null = await this.userRepository.findOneBy({
      handle,
    });

    if (existingUser !== null) {
      throw new BadRequestException();
    }

    const hashedPassword = await hash(password);

    const user = await this.userRepository.save({
      handle,
      password: hashedPassword,
    });

    return this.loginUser(user.handle, user.uuid);
  }

  public async loginUser(
    handle: string,
    password: string
  ): Promise<TokenResponse> {
    const user: User | null = await this.userRepository.findOneBy({ handle });

    if (user === null) {
      throw new NotFoundException();
    }

    if (compare(password, user.password)) {
      return this.signToken(user.handle, user.uuid);
    }

    throw new BadRequestException();
  }

  private signToken(handle: string, userId: string): TokenResponse {
    const token: string = sign(
      {
        handle,
      },
      this.options.secretKey,
      {
        algorithm: 'HS256',
        expiresIn: 3600 * 2,
        subject: userId,
        audience: this.options.audience,
        issuer: this.options.issuer,
      }
    );

    const refreshToken = this.generateRefreshToken();

    // save refresh token that is valid for 24 hours
    this.redisService.forConnection(TOKEN_CACHE).set(
      refreshToken,
      JSON.stringify({
        handle,
        sub: userId,
      }),
      3600 * 24
    );

    return {
      token,
      refreshToken,
      exp: Math.floor(Date.now() / 1000) + 7200,
    };
  }

  public async refreshToken(refreshToken: string, userId: string) {
    const value: string | null = await this.redisService
      .forConnection(TOKEN_CACHE)
      .get(refreshToken);

    if (value === null) {
      throw new BadRequestException();
    }

    const { handle, sub }: RefreshTokenData = JSON.parse(value);

    if (userId !== sub) {
      throw new BadRequestException();
    }

    await this.redisService.forConnection(TOKEN_CACHE).delete(refreshToken);

    return this.signToken(handle, sub);
  }

  private generateRefreshToken(): string {
    return randomBytes(20).toString('hex');
  }
}
