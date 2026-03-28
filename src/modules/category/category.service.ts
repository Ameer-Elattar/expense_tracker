import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryInput } from './dto/create-category.input';
import { UpdateCategoryInput } from './dto/update-category.input';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll(currentUserId: number) {
    return this.categoryRepo.find({
      where: { isActive: true, userId: currentUserId },
    });
  }

  async create(input: CreateCategoryInput, currentUserId: number) {
    const category = this.categoryRepo.create({
      ...input,
      userId: currentUserId,
    });
    return this.categoryRepo.save(category);
  }

  async findOne(id: number, currentUserId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id, isActive: true, userId: currentUserId },
    });

    if (!category) throw new NotFoundException('Category not Found');
    return category;
  }

  async update(id: number, input: UpdateCategoryInput, currentUserId: number) {
    const category = await this.findOneOrFail(id, currentUserId);
    Object.assign(category, input);
    return this.categoryRepo.save(category);
  }

  async delete(id: number, currentUserId: number) {
    const category = await this.findOneOrFail(id, currentUserId);
    await this.categoryRepo.remove(category);
    return 'Category deleted';
  }

  async deactivate(id: number, currentUserId: number) {
    const category = await this.findOneOrFail(id, currentUserId);
    if (!category.isActive) return 'Category is already deactivated';
    category.isActive = false;
    await this.categoryRepo.save(category);
    return 'Category deactivated';
  }

  async activate(id: number, currentUserId: number) {
    const category = await this.findOneOrFail(id, currentUserId);
    if (category.isActive) return 'Category is already active';
    category.isActive = true;
    await this.categoryRepo.save(category);
    return 'Category activated';
  }

  private async findOneOrFail(id: number, currentUserId: number) {
    const category = await this.categoryRepo.findOne({
      where: { id, userId: currentUserId },
    });

    if (!category) throw new NotFoundException('Category not Found');
    return category;
  }
}
