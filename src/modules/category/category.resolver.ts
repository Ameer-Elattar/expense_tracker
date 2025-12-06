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
import {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './model/category.type';

import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { ConfigService } from '@nestjs/config';
@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly configService: ConfigService,
  ) {}

  @Query(() => [Category], { name: 'categories' })
  getCategories() {
    return this.categoryService.findAll();
  }
  @Query(() => Category, { name: 'getCategory' })
  getCategoryById(@Args('id', { type: () => ID }) id: number) {
    return this.categoryService.findOne(id);
  }

  @Mutation(() => Category, { name: 'createCategory' })
  create(
    @Args('category') input: CreateCategoryInput,
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
    file: FileUpload,
  ) {
    return this.categoryService.create(input, file);
  }

  @Mutation(() => Category, { name: 'updateCategory' })
  update(
    @Args('id', { type: () => ID }) id: number,
    @Args('category') input: UpdateCategoryInput,
    @Args({ name: 'file', type: () => GraphQLUpload, nullable: true })
    file: FileUpload,
  ) {
    return this.categoryService.update(id, input, file);
  }

  @Mutation(() => String)
  delete(@Args('id', { type: () => ID }) id: number) {
    return this.categoryService.delete(id);
  }

  @Mutation(() => String)
  deactive(@Args('id', { type: () => ID }) id: number) {
    return this.categoryService.deactivate(id);
  }
  @Mutation(() => String)
  activate(@Args('id', { type: () => ID }) id: number) {
    return this.categoryService.activate(id);
  }

  @ResolveField(() => String, { nullable: true })
  imageUrl(@Parent() category: Category) {
    if (!category.icon) return null;
    const baseUrl = this.configService.get<string>('BASE_URL');
    return `${baseUrl}/${category.icon}`;
  }
}
