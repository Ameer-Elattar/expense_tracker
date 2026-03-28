import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountInput } from './dto/create-account.input';
import { UpdateAccountInput } from './dto/update-account.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}
  create(createAccountInput: CreateAccountInput, currentUserId: number) {
    const account = this.accountRepo.create({
      ...createAccountInput,
      balance: createAccountInput.balance * 100,
      userId: currentUserId,
    });
    return this.accountRepo.save(account);
  }

  findAll(currentUserId: number) {
    return this.accountRepo.find({ where: { userId: currentUserId } });
  }

  async findOne(id: number, currentUserId: number) {
    const account = await this.accountRepo.findOne({
      where: { id, userId: currentUserId },
    });
    if (!account) throw new NotFoundException('Account Not found');
    return account;
  }

  async update(
    id: number,
    updateAccountInput: UpdateAccountInput,
    currentUserId: number,
  ) {
    const account = await this.findOne(id, currentUserId);
    this.accountRepo.merge(account, updateAccountInput);
    return this.accountRepo.save(account);
  }

  async remove(id: number, currentUserId: number) {
    const record = await this.findOne(id, currentUserId);
    await this.accountRepo.remove(record);
    return 'Account Deleted';
  }
}
