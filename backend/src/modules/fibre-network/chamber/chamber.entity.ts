import {
  Table,
  Column,
  Model,
  AutoIncrement,
  PrimaryKey,
  AllowNull,
} from 'sequelize-typescript';

@Table({
  tableName: 'chamber',
  modelName: 'chamber',
  underscored: true,
})
export class ChamberEntity extends Model {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column
  declare id: number;
}
