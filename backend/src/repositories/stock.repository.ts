import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { Stock } from '../entities/stock.entity';
import { CreateStockDto } from '../modules/stock/dto/createStock.dto';

export class StockRepository {
  constructor(
    @InjectModel(Stock.name) private readonly stockModel: Model<Stock>,
  ) {}

  async createStock(createStockDto: CreateStockDto, session: ClientSession) {
    let stock = await this.getStockByTicker(createStockDto.ticker);

    if (stock) {
      throw new ConflictException('Stock already exists');
    }

    stock = new this.stockModel({
      name: createStockDto.name,
      ticker: createStockDto.ticker,
    });

    try {
      stock = await stock.save({ session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!stock) {
      throw new ConflictException('Stock not created');
    }

    return stock;
  }

  async getStockByTicker(ticker: string) {
    let stock;
    try {
      stock = await this.stockModel.findOne({ ticker });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return stock;
  }

  async getAllStocks() {
    try {
      return this.stockModel.find({});
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
