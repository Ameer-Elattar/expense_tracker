import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Request } from 'express';

export type UserPayloadType = {
  id: number;
  username: string;
};

@ObjectType()
export class TokenResponse {
  @Field()
  accessToken: string;
}

export interface GqlContext {
  req: Request;
}
export enum CurrencyEnum {
  EGP = 'egp',
  USD = 'usd',
  SAR = 'sar',
}
registerEnumType(CurrencyEnum, { name: 'CurrencyEnum' });
