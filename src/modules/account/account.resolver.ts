import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Float,
  Parent,
} from '@nestjs/graphql';
import { AccountService } from './account.service';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { Account } from './model/account.model';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Mutation(() => Account)
  createAccount(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
  ) {
    return this.accountService.create(createAccountInput);
  }

  @Query(() => [Account], { name: 'accounts' })
  findAll() {
    return this.accountService.findAll();
  }

  @Query(() => Account, { name: 'account' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.accountService.findOne(id);
  }

  @Mutation(() => Account)
  updateAccount(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAccountInput') updateAccountInput: UpdateAccountInput,
  ) {
    return this.accountService.update(id, updateAccountInput);
  }

  @Mutation(() => String)
  removeAccount(@Args('id', { type: () => Int }) id: number) {
    return this.accountService.remove(id);
  }

  @ResolveField(() => Float, { nullable: true })
  balance(@Parent() account: Account) {
    return account.balanceInCents / 100;
  }
}
