import { Module } from '@nestjs/common';
import { ChamberService } from './chamber.service';
import { ChamberEntity } from './chamber.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([ChamberEntity])],
  providers: [ChamberService],
  exports: [ChamberService],
})
export class ChamberModule {}
