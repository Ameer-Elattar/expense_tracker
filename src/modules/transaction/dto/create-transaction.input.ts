import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CurrencyEnum } from 'src/common/utils/types';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from '../entities/transaction.entity';

@InputType()
export class CreateTransactionInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  amount: number;

  @Field(() => CurrencyEnum)
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;

  @Field(() => TransactionType)
  @IsEnum(TransactionType)
  type: TransactionType;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  accountId: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(1)
  @IsOptional()
  categoryId?: number;

  @Field(() => Int, { nullable: true })
  @ValidateIf(
    (txn: CreateTransactionInput) => txn.type === TransactionType.TRANSFER,
  )
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  linkedTransactionId?: number;
}
