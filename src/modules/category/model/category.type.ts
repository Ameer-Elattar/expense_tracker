import {
  Field,
  ID,
  InputType,
  ObjectType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
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

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  iconUrl?: string;

  @Field()
  isActive: boolean;
}

@InputType()
export class CreateCategoryInput {
  @IsNotEmpty()
  @Field()
  name: string;

  @IsEnum(CategoryType)
  @IsOptional()
  @Field(() => CategoryType, { nullable: true })
  type?: CategoryType;

  @Field({ nullable: true })
  icon?: string;
}

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {}
