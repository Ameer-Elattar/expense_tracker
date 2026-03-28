import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { CurrencyEnum } from 'src/common/utils/types';
import { Account } from 'src/modules/account/model/account.model';
import { Category } from 'src/modules/category/model/category.type';
import { User } from 'src/modules/user/model/user.model';
import { TransactionType } from '../entities/transaction.entity';

registerEnumType(TransactionType, { name: 'TransactionType' });

@ObjectType()
export class Transaction {
  @Field(() => ID)
  id: number;

  @Field(() => Float)
  amount: number;

  @Field(() => CurrencyEnum)
  currency: CurrencyEnum;

  @Field(() => TransactionType)
  type: TransactionType;

  @Field(() => GraphQLISODateTime)
  @Type(() => Date)
  date: Date;

  @Field({ nullable: true })
  description?: string;

  @Field(() => ID)
  accountId: number;

  @Field(() => ID)
  categoryId: number;

  @Field(() => Int, { nullable: true })
  linkedTransactionId?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
