import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { JwtService } from '@nestjs/jwt';
import { JWTPayloadType } from 'src/common/utils/types';
import { LoginInput } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserInput) {
    const user = await this.userService.create(dto);
    const accessToken = await this.createToken(user);
    return accessToken;
  }

  async login(dto: LoginInput) {
    const { email, password } = dto;
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Invalid email or password');
    const isCorrectPasseord = await bcrypt.compare(password, user.password);
    if (!isCorrectPasseord)
      throw new BadRequestException('Invalid email or password');
    const accessToken = await this.createToken(user);
    return accessToken;
  }

  private async createToken(user: User) {
    const payload: JWTPayloadType = { id: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken };
  }
}
