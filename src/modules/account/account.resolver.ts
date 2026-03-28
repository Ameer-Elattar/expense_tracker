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

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayloadType } from 'src/common/utils/types';
import { UserService } from '../user/user.service';
import { User } from '../user/model/user.model';

@Resolver(() => Account)
export class AccountResolver {
  constructor(
    private readonly accountService: AccountService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Account)
  createAccount(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.accountService.create(createAccountInput, user.id);
  }

  @Query(() => [Account], { name: 'accounts' })
  findAll(@CurrentUser() user: UserPayloadType) {
    return this.accountService.findAll(user.id);
  }

  @Query(() => Account, { name: 'account' })
  findOne(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.accountService.findOne(id, user.id);
  }

  @Mutation(() => Account)
  updateAccount(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAccountInput') updateAccountInput: UpdateAccountInput,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.accountService.update(id, updateAccountInput, user.id);
  }

  @Mutation(() => String)
  removeAccount(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.accountService.remove(id, user.id);
  }

  @ResolveField(() => Float, { nullable: true })
  balance(@Parent() account: Account) {
    return account.balance / 100;
  }

  @ResolveField(() => User)
  user(@Parent() account: Account) {
    return this.userService.findOne(account.userId);
  }
}
