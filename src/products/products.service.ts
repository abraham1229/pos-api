import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({ id: createProductDto.categoryId })
    if (!category) {
      let errors: string[] = []
      errors.push('Category does not exist')
      throw new NotFoundException(errors)
    }

    return this.productRepository.save({
      ...createProductDto,
      category // I can send it complete because of type cascade on category relation
    })

  }

  async findAll(categoryId: number | null, take: number, skip: number) {
    const options: FindManyOptions<Product> = {
      relations: {
        category: true
      },
      order: {
        id: 'DESC'
      },
      take: take,
      skip: skip
    }

    if (categoryId) {
      options.where = {
        category: {
          id: categoryId
        }
      }
    }

    const [products, total] = await this.productRepository.findAndCount(options)

    return {
      products,
      total
    }

  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true
      }
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id)
    Object.assign(product, updateProductDto)

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOneBy({ id: updateProductDto.categoryId })
      if (!category) {
        let errors: string[] = []
        errors.push('Category does not exist')
        throw new NotFoundException(errors)
      }

      product.category = category
    }

    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return 'Product deleted successfully';
  }
}
