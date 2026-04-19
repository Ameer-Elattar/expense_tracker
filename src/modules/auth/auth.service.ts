import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserInput } from '../user/dto/create-user.input';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadType } from 'src/common/utils/types';
import { LoginInput } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: CreateUserInput) {
    const user = await this.userService.create(dto);
    const { refreshToken, accessToken } = await this.createTokens(user);
    await this.updateUserRefreshToken(user.id, refreshToken);
    return { refreshToken, accessToken };
  }

  async login(dto: LoginInput) {
    const { email, password } = dto;
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new BadRequestException('Invalid email or password');
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      throw new BadRequestException('Invalid email or password');
    const { refreshToken, accessToken } = await this.createTokens(user);
    await this.updateUserRefreshToken(user.id, refreshToken);
    return { refreshToken, accessToken };
  }

  private async createTokens(user: User) {
    const payload: UserPayloadType = { id: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES'),
    });
    return { accessToken, refreshToken };
  }

  private async updateUserRefreshToken(id: number, token: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(token, salt);
    await this.userService.saveRefreshToken(id, hashedToken);
  }
}
