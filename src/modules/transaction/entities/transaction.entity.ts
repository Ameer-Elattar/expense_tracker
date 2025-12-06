import { CurrencyEnum, TransactionType } from 'src/common/utils/types';
import { Account } from 'src/modules/account/entities/account.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amountInCents: number;

  @Column({ type: 'enum', enum: CurrencyEnum })
  currency: CurrencyEnum;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToOne(() => Category, (category) => category.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ name: 'linked_transaction_id', nullable: true })
  linkedTransactionId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
