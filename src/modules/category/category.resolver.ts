import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { Category } from './model/category.model';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserPayloadType } from 'src/common/utils/types';
import { UserService } from '../user/user.service';
@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [Category], { name: 'categories' })
  getCategories(@CurrentUser() user: UserPayloadType) {
    return this.categoryService.findAll(user.id);
  }
  @Query(() => Category, { name: 'getCategory' })
  getCategoryById(
    @Args('id', { type: () => ID }) id: number,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.categoryService.findOne(id, user.id);
  }

  @Mutation(() => Category, { name: 'createCategory' })
  create(
    @Args('category') input: CreateCategoryInput,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.categoryService.create(input, user.id);
  }

  @Mutation(() => Category, { name: 'updateCategory' })
  update(
    @Args('id', { type: () => ID }) id: number,
    @Args('category') input: UpdateCategoryInput,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.categoryService.update(id, input, user.id);
  }

  @Mutation(() => String)
  delete(
    @Args('id', { type: () => ID }) id: number,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.categoryService.delete(id, user.id);
  }

  @Mutation(() => String)
  deactive(
    @Args('id', { type: () => ID }) id: number,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.categoryService.deactivate(id, user.id);
  }
  @Mutation(() => String)
  activate(
    @Args('id', { type: () => ID }) id: number,
    @CurrentUser() user: UserPayloadType,
  ) {
    return this.categoryService.activate(id, user.id);
  }
}
