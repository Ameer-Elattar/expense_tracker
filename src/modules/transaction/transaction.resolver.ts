import {
  Args,
  Float,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Mutation } from '@nestjs/graphql';
import { Transaction } from './model/transaction.model';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayloadType } from 'src/common/utils/types';
import { User } from '../user/model/user.model';
import { Account } from '../account/model/account.model';
import { Category } from '../category/model/category.type';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { AccountService } from '../account/account.service';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly accountService: AccountService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Transaction)
  createTransaction(
    @CurrentUser() currentUser: UserPayloadType,
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ) {
    return this.transactionService.create(
      createTransactionInput,
      currentUser.id,
    );
  }

  @Query(() => [Transaction], { name: 'transactions' })
  findAll(@CurrentUser() currentUser: UserPayloadType) {
    return this.transactionService.findAll(currentUser.id);
  }

  @Query(() => Transaction, { name: 'transaction' })
  findOne(
    @CurrentUser() currentUser: UserPayloadType,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.transactionService.findOne(id, currentUser.id);
  }

  @ResolveField(() => Account)
  account(
    @Parent() txn: Transaction,
    @CurrentUser() currentUser: UserPayloadType,
  ) {
    return this.accountService.findOne(txn.accountId, currentUser.id);
  }

  @ResolveField(() => Category)
  category(
    @Parent() txn: Transaction,
    @CurrentUser() currentUser: UserPayloadType,
  ) {
    return this.categoryService.findOne(txn.categoryId, currentUser.id);
  }

  @ResolveField(() => Float)
  amount(@Parent() txn: Transaction) {
    return txn.amount / 100;
  }
}
