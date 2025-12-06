import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from './model/category.type';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { FileUpload } from 'graphql-upload-ts';
import { saveImage, deleteImage } from 'src/helpers/imageMangment.helper';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepo.find({ where: { isActive: true } });
  }

  async create(input: CreateCategoryInput, file?: FileUpload) {
    if (file) {
      input.icon = await saveImage(file);
    }
    const category = this.categoryRepo.create(input);
    return this.categoryRepo.save(category);
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where: { id, isActive: true },
    });

    if (!category) throw new NotFoundException('Category not Found');
    return category;
  }

  async update(id: number, input: UpdateCategoryInput, file?: FileUpload) {
    const category = await this.findOne(id);
    if (file) {
      if (category.icon) {
        await deleteImage(category.icon);
      }
      input.icon = await saveImage(file);
    }
    Object.assign(category, input);
    return this.categoryRepo.save(category);
  }

  async delete(id: number) {
    const category = await this.findOne(id);
    if (category.icon) {
      await deleteImage(category.icon);
    }
    await this.categoryRepo.remove(category);
    return 'Category deleted';
  }

  async deactivate(id: number) {
    const category = await this.findOne(id);
    if (!category.isActive) return 'Category is already deactivated';
    category.isActive = false;
    await this.categoryRepo.save(category);
    return 'Category deactivated';
  }

  async activate(id: number) {
    const category = await this.findOne(id);
    if (category.isActive) return 'Category is already active';
    category.isActive = true;
    await this.categoryRepo.save(category);
    return 'Category activated';
  }
}
