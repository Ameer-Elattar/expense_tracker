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
  create(createAccountInput: CreateAccountInput) {
    const account = this.accountRepo.create(createAccountInput);
    return this.accountRepo.save(account);
  }

  findAll() {
    return this.accountRepo.find();
  }

  async findOne(id: number) {
    const record = await this.accountRepo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Account Not found');
    return record;
  }

  async update(id: number, updateAccountInput: UpdateAccountInput) {
    const record = await this.accountRepo.preload({
      id,
      ...updateAccountInput,
    });
    if (!record) {
      throw new NotFoundException('Account not found');
    }

    return this.accountRepo.save(record);
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    await this.accountRepo.remove(record);
    return 'Account Deleted';
  }
}
