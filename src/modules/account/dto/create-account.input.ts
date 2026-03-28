import { InputType, Field, Float } from '@nestjs/graphql';
import { AccountType } from '../entities/account.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CurrencyEnum } from 'src/common/utils/types';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => AccountType)
  @IsEnum(AccountType)
  type: AccountType;

  @Field(() => Float)
  @IsNumber()
  balance: number;

  @IsString()
  @Field(() => CurrencyEnum)
  currency: CurrencyEnum;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
