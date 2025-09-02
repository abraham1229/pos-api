import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    private readonly couponService: CouponsService
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {

    //Manager has acces to all the entitys
    //Create a transaction to have better control
    await this.productRepository.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction()
      const total = createTransactionDto.contents.reduce((total, content) => total + (content.quantity * content.price), 0)
      transaction.total = total

      //Apply the coupon if it exists
      if (createTransactionDto.coupon) {
        const coupon = await this.couponService.applyCoupon(createTransactionDto.coupon)
        const discount =  total * coupon.percentage / 100
        transaction.discount = discount
        transaction.coupon = coupon.name
        transaction.total -= discount
      }

      for (const content of createTransactionDto.contents) {
        const product = await transactionEntityManager.findOneBy(Product, { id: content.productId })
        const errors: string[] = []

        if (!product) {
          errors.push(`ProductId ${content.productId} not found`)
          throw new NotFoundException(errors)
        }

        if (content.quantity > product.inventory) {
          errors.push(`The product ${product.name} is over the available stock`)
          throw new BadRequestException(errors)
        }

        product.inventory -= content.quantity

        // Create TransactionContents instance
        const transactionContent = new TransactionContents()
        transactionContent.quantity = content.quantity
        transactionContent.price = content.price
        transactionContent.transaction = transaction
        transactionContent.product = product // This product will update because of cascade

        await transactionEntityManager.save(transaction)
        await transactionEntityManager.save(transactionContent)
      }

    })

    return {message: "Transaction saved successfully"}
  }

  findAll(transactionDate?: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }

    if (transactionDate) {
      const date = parseISO(transactionDate)
      if (!isValid(date)) {
        throw new BadRequestException('Invalid date')
      }

      const start = startOfDay(date)
      const end = endOfDay(date)

      options.where = {
        transactionDate: Between(start, end)
      }
    }

    return this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    })

    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }

    return transaction;
  }

  async remove(id: number) {
    const transaction = await this.findOne(id)
    for (const content of transaction.contents) {
      //Delete transaction contents
      const transactionContents = await this.transactionContentsRepository.findOneBy({ id: content.id })
      if (!transactionContents) continue
      await this.transactionContentsRepository.remove(transactionContents)

      //Change inventory
      const product = await this.productRepository.findOneBy({ id: content.product.id })
      if (!product) continue
      product.inventory += content.quantity
      await this.productRepository.save(product)
    }

    // Delete transactions
    await this.transactionRepository.remove(transaction)

    return { message: 'Transaction deleted' };
  }
}
