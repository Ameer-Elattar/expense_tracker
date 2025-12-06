import { InputType, Field, Int } from '@nestjs/graphql';
import { AccountType } from '../entities/account.entity';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateAccountInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => AccountType)
  @IsEnum(AccountType)
  type: AccountType;

  @Field(() => Int)
  @IsNumber()
  balanceInCents: number;

  @Field()
  @IsString()
  currency: string;

  @Field({ nullable: true })
  @IsOptional()
  notes?: string;
}
