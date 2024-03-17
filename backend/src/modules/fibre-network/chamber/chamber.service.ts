import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChamberEntity } from './chamber.entity';
import {
  toDomain,
  toDomainArray,
} from '../../../infra/db/postgres/postgres-config/postgres.util';
import { Chamber } from './chamber.interface';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Fn, Literal, Col } from 'sequelize/types/utils';

@Injectable()
export class ChamberService {
  constructor(
    @InjectModel(ChamberEntity)
    private chamberRepository: typeof ChamberEntity,
  ) {}

  public async findAll(): Promise<Chamber[]> {
    const chambers = await this.chamberRepository.findAll<ChamberEntity>();
    return toDomainArray(chambers);
  }

  public async getClosestChamberAvailable(
    neededCapacity: number,
    latitude: number,
    longitude: number,
  ): Promise<{
    success: boolean;
    isClosest: boolean;
    chamberId: string | null;
    message: string;
  }> {
    const closestAvailableChamber = await this.findClosestAvailableChamber(
      neededCapacity,
      latitude,
      longitude,
    );

    if (!closestAvailableChamber) {
      return {
        success: false,
        isClosest: false,
        chamberId: null,
        message: 'No chamber available',
      };
    }

    const closestChamber = await this.findClosestChamber(latitude, longitude);

    const isClosest = Boolean(
      closestAvailableChamber &&
        closestChamber &&
        closestAvailableChamber.id === closestChamber?.id,
    );

    const message = isClosest
      ? 'Closest chamber is available.'
      : 'Found available chamber. (Not closest chamber!)';

    return {
      success: true,
      isClosest,
      chamberId: closestAvailableChamber.id,
      message,
    };
  }

  public async updateChamberUsedCapacityById(
    chamberId: string,
    capacity: number,
    transaction: Transaction,
  ): Promise<any> {
    return this.updateDBChamberById(
      chamberId,
      { usedCapacity: Sequelize.literal(`used_capacity + ${capacity}`) },
      transaction,
    );
  }

  private async findClosestAvailableChamber(
    neededCapacity: number,
    latitude: number,
    longitude: number,
  ): Promise<Chamber | null> {
    // SELECT * FROM chambers
    // WHERE (used_capacity + 30) <= total_capacity
    // ORDER BY ST_Distance(geom, ST_MakePoint(-0.083315, 51.523305))
    // LIMIT 1;
    const chambers = await this.chamberRepository.findAll({
      where: Sequelize.literal(
        `used_capacity + ${neededCapacity} <= total_capacity`,
      ),
      order: [
        [
          Sequelize.literal(
            `ST_DISTANCE(geom, ST_MakePoint(${longitude}, ${latitude}))`,
          ),
          'ASC',
        ],
      ],
      limit: 1,
    });

    return chambers[0] ? toDomain(chambers[0]) : null;
  }

  private async findClosestChamber(
    latitude: number,
    longitude: number,
  ): Promise<Chamber | null> {
    // SELECT * FROM chambers
    // ORDER BY ST_Distance(geom, ST_MakePoint(-0.083315, 51.523305))
    // LIMIT 1;
    const chambers = await this.chamberRepository.findAll({
      where: {},
      order: [
        [
          Sequelize.literal(
            `ST_DISTANCE(geom, ST_MakePoint(${longitude}, ${latitude}))`,
          ),
          'ASC',
        ],
      ],
      limit: 1,
    });

    return chambers[0] ? toDomain(chambers[0]) : null;
  }

  private async updateDBChamberById(
    chamberId: string,
    update: Partial<Chamber> | { [key in keyof Chamber]?: Fn | Col | Literal },
    transaction: Transaction,
  ): Promise<Chamber | null> {
    const [, [updatedChamber]] = await this.chamberRepository.update(
      { ...update },
      { where: { id: chamberId }, transaction, returning: true },
    );
    return updatedChamber ? toDomain(updatedChamber) : null;
  }
}
