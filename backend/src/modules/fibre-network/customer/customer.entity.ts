import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AllowNull,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ChamberEntity } from '../chamber/chamber.entity';

@Table({
  tableName: 'customer',
  modelName: 'customer',
  underscored: true,
})
export class CustomerEntity extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUIDV4,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  address: string;

  @AllowNull(false)
  @Column
  postcode: string;

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
  capacity: number;

  @ForeignKey(() => ChamberEntity)
  @Column({
    type: DataType.STRING(10),
    onUpdate: 'cascade',
    onDelete: 'restrict',
  })
  chamberId: string | null;

  @Column({ type: DataType.DATE })
  createdAt: Date;

  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
