import {
  Field,
  Float,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { AccountType } from '../entities/account.entity';
import { Transaction } from 'src/modules/transaction/model/transaction.model';
import { CurrencyEnum } from 'src/common/utils/types';

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
  balance: number;

  @Field(() => CurrencyEnum)
  currency: CurrencyEnum;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => Int)
  userId: number;

  @Field(() => [Transaction], { nullable: true })
  transactions?: Transaction[];

  @Field(() => Date)
  createdDate: Date;

  @Field(() => Date)
  updatedDate: Date;
}
