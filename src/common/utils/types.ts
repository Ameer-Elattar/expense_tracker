import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Request, Response } from 'express';

export type UserPayloadType = {
  id: number;
  username: string;
};

@ObjectType()
export class TokenResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

export interface GqlContext {
  req: Request;
  res: Response;
}
export enum CurrencyEnum {
  EGP = 'egp',
  USD = 'usd',
  SAR = 'sar',
}
registerEnumType(CurrencyEnum, { name: 'CurrencyEnum' });
