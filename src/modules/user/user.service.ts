import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  async create(createUserInput: CreateUserInput) {
    const { email, password, username } = createUserInput;
    const isUserExisted = await this.userRepo.findOne({ where: { email } });
    if (isUserExisted) throw new BadRequestException('User already existed');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({
      username,
      email,
      password: hashedPassword,
    });
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  findOne(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  findOneByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async saveRefreshToken(id: number, token: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.hashedRefreshToken = token;
    return await this.userRepo.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
