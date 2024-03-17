import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChamberEntity } from './chamber.entity';

@Injectable()
export class ChamberService {
  constructor(
    @InjectModel(ChamberEntity)
    private chamberRepository: typeof ChamberEntity,
  ) {}

  async findAll(): Promise<ChamberEntity[]> {
    return this.chamberRepository.findAll<ChamberEntity>();
  }
}
