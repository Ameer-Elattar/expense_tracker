import { CurrencyEnum } from 'src/common/utils/types';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AccountType {
  CASH = 'cash',
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: AccountType })
  type: AccountType;

  @Column({ type: 'int' })
  balanceInCents: number;

  @Column()
  currency: CurrencyEnum;

  @Column({ nullable: true })
  notes?: string;

  @OneToMany(() => Transaction, (transaction) => transaction)
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
