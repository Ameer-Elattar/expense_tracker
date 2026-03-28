import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CategoryType } from '../entities/category.entity';
import { User } from 'src/modules/user/model/user.model';

registerEnumType(CategoryType, { name: 'CategoryType' });

@ObjectType()
export class Category {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  type: CategoryType;

  @Field(() => User)
  user: User;

  @Field()
  userId: number;

  @Field()
  isActive: boolean;
}
