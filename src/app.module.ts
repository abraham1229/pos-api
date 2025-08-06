import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true //To get the env variables cause is not a module
    }),
    TypeOrmModule.forRootAsync({
      useFactory: typeOrmConfig,  //To get the db
      inject: [ConfigService]
    }),
    CategoriesModule,
    ProductsModule,
    TransactionsModule,
    CouponsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
