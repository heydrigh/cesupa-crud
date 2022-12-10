import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  public verifyPassword(
    hashedPassword: string,
    challenge: string,
  ): Promise<boolean> {
    return argon2.verify(hashedPassword, challenge);
  }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const createNewUser = new User({
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
    });

    const user = await this.userRepository.save(createNewUser);

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
