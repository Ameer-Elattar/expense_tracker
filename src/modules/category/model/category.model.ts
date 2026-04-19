import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CategoryType } from '../entities/category.entity';

registerEnumType(CategoryType, { name: 'CategoryType' });

@ObjectType()
export class Category {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  type: CategoryType;

  @Field()
  userId: number;

  @Field()
  isActive: boolean;
}
