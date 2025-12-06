import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { AccountType } from '../entities/account.entity';

registerEnumType(AccountType, { name: 'AccountType' });

@ObjectType()
export class Account {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => AccountType)
  type: AccountType;

  @Field(() => Int)
  balanceInCents: number;

  @Field(() => Float, { nullable: true })
  balance?: number;

  @Field()
  currency: string;

  @Field({ nullable: true })
  notes?: string;
}
