import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/modules/account/model/account.model';
import { Category } from 'src/modules/category/model/category.type';
import { Transaction } from 'src/modules/transaction/model/transaction.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(() => [Account], { nullable: true })
  accounts?: Account[];

  @Field(() => [Transaction], { nullable: true })
  transactions?: Transaction[];

  @Field(() => [Category], { nullable: true })
  categories?: Category[];
}
