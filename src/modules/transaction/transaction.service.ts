import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateTransactionInput } from './dto/create-transaction.input';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(currentUserId: number) {
    return this.transactionRepo.find({
      where: { userId: currentUserId },
    });
  }

  async findOne(id: number, currentUserId: number) {
    const txn = await this.transactionRepo.findOne({
      where: { id, userId: currentUserId },
    });
    if (!txn) throw new NotFoundException('Transaction not found');
    return txn;
  }

  create(input: CreateTransactionInput, currentUserId: number) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const txn = manager.create(Transaction, {
        ...input,
        amount: input.amount * 100,
        userId: currentUserId,
      });
      const account = await manager.findOne(Account, {
        where: { id: input.accountId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!account) {
        throw new NotFoundException("Selected Account doesn't exist");
      }
      if (txn.currency !== account.currency)
        throw new BadRequestException(
          'Transaction and Account must have the same currency',
        );
      txn.account = account;
      if (txn.type === TransactionType.TRANSFER) {
        await this.transferTransaction(txn, manager);
      } else {
        await this.incomeExpenseTransaction(txn, manager);
      }
      return manager.save(txn);
    });
  }
  private async transferTransaction(txn: Transaction, manager: EntityManager) {
    const toAccount = await manager.findOne(Account, {
      where: { id: txn.linkedTransactionId },
      lock: { mode: 'pessimistic_write' },
    });
    if (!toAccount)
      throw new NotFoundException(
        "Can't apply this transaction, destination account doesn't exist",
      );
    if (txn.account.balance < txn.amount) {
      throw new BadRequestException('Insufficient balance for transfer');
    }
    if (toAccount.id === txn.account.id) {
      throw new BadRequestException('Cannot transfer to the same account');
    }
    if (toAccount.currency !== txn.account.currency)
      throw new BadRequestException(
        'Both Accounts must have the same currency',
      );
    txn.account.balance -= txn.amount;
    toAccount.balance += txn.amount;
    await manager.save([txn.account, toAccount]);
  }
  private async incomeExpenseTransaction(
    txn: Transaction,
    manager: EntityManager,
  ) {
    if (txn.type === TransactionType.EXPENSE) {
      if (txn.account.balance < txn.amount) {
        throw new BadRequestException('Insufficient balance for expense');
      }
      txn.account.balance -= txn.amount;
    } else if (txn.type === TransactionType.INCOME) {
      txn.account.balance += txn.amount;
    } else {
      throw new BadRequestException('Unsupported transaction type');
    }
    await manager.save(txn.account);
  }
}
