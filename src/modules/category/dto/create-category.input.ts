import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsEnum(CategoryType)
  @Field(() => CategoryType)
  type: CategoryType;
}
