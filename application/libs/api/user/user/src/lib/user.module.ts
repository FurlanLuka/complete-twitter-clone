import { DynamicModule, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserOptions } from './user.interfaces';
import { UserService } from './user.service';

@Module({})
@Global()
export class UserModule {
  static register(options: UserOptions): DynamicModule {
    return {
      module: UserModule,
      imports: [...options.imports, TypeOrmModule.forFeature([User])],
      providers: [
        {
          inject: options.inject,
          provide: 'USER_OPTIONS',
          useFactory: options.useFactory,
        },
        UserService,
      ],
      controllers: [UserController],
      exports: [UserService]
    };
  }
}
