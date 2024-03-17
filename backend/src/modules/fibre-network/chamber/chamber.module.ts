import { Module } from '@nestjs/common';
import { ChamberService } from './chamber.service';
import { ChamberController } from './chamber.controller';
import { ChamberEntity } from './chamber.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([ChamberEntity])],
  providers: [ChamberService],
  exports: [ChamberService],
  controllers: [ChamberController],
})
export class ChamberModule {}
