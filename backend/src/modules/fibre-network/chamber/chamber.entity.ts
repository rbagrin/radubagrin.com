import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

@Table({
  tableName: 'chambers',
  modelName: 'chambers',
  underscored: true,
})
export class ChamberEntity extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column
  declare id: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  latitude: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  longitude: number;

  @Column({ type: DataTypes.GEOGRAPHY('POINT', 4326), allowNull: false })
  geom: {
    coordinates: number[];
    type: 'Point';
    crs: Record<string, unknown>;
  };

  @Column({ type: DataType.INTEGER, allowNull: false })
  totalCapacity: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  usedCapacity: number;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
