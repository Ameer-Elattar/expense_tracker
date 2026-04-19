import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GqlContext, UserPayloadType } from '../utils/types';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { req, res } = ctx.getContext<GqlContext>();

    const authHeader: string | undefined = req?.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    try {
      const payload: UserPayloadType = await this.jwtService.verifyAsync(
        token,
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        },
      );

      req['user'] = payload;

      return true;
    } catch (err) {
      if ((err as { name?: string })?.name !== 'TokenExpiredError') {
        throw new UnauthorizedException('Invalid token');
      }

      const refreshToken = this.extractTokenFromRefreshHeader(req?.headers);
      if (!refreshToken) {
        throw new UnauthorizedException(
          'Access token expired and refresh token is missing',
        );
      }

      let refreshPayload: UserPayloadType;
      try {
        refreshPayload = await this.jwtService.verifyAsync(refreshToken, {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });
      } catch {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      const user = await this.userService.findOne(refreshPayload.id);
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isRefreshTokenValid = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload: UserPayloadType = {
        id: user.id,
        username: user.username,
      };

      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRES'),
      });

      req['user'] = payload;
      req.headers.authorization = `Bearer ${newAccessToken}`;
      res?.setHeader('x-access-token', newAccessToken);

      return true;
    }
  }

  private extractTokenFromRefreshHeader(
    headers?: Record<string, string | string[] | undefined>,
  ): string | null {
    if (!headers) {
      return null;
    }

    const refreshHeader =
      headers['x-refresh-token'] ??
      headers['refresh-token'] ??
      headers.refreshtoken;

    const headerValue = Array.isArray(refreshHeader)
      ? refreshHeader[0]
      : refreshHeader;

    if (!headerValue) {
      return null;
    }

    const [type, token] = headerValue.split(' ');
    if (type === 'Bearer' && token) {
      return token;
    }

    return headerValue;
  }
}
