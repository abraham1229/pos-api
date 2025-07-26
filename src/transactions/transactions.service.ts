import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>
  ) { }

  async create(createTransactionDto: CreateTransactionDto) {

    //Manager has acces to all the entitys
    //Create a transaction to have better control
    await this.productRepository.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction()
      const total = createTransactionDto.contents.reduce((total, content) => total + (content.quantity * content.price), 0)
      transaction.total = total

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

    return "Transaction saved successfully"
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

    const transactions = this.transactionRepository.find(options)

    return transactions;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
