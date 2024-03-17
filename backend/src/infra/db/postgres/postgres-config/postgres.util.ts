import { Model } from 'sequelize-typescript';

export type ModelData<T extends Model<T, unknown>> = Omit<
  T,
  | 'isInitialized'
  | 'init'
  | '$add'
  | '$set'
  | '$get'
  | '$count'
  | '$create'
  | '$has'
  | '$remove'
  | 'addHook'
  | 'changed'
  | 'decrement'
  | 'destroy'
  | 'equals'
  | 'equalsOneOf'
  | 'get'
  | 'getDataValue'
  | 'hasHook'
  | 'hasHooks'
  | 'increment'
  | 'isNewRecord'
  | 'isSoftDeleted'
  | 'previous'
  | 'reload'
  | 'removeHook'
  | 'restore'
  | 'save'
  | 'sequelize'
  | 'set'
  | 'setAttributes'
  | 'setDataValue'
  | 'toJSON'
  | 'update'
  | 'validate'
  | 'version'
  | 'where'
  | '_model'
  | '_creationAttributes'
  | '_attributes'
  | 'toDomain'
  | 'dataValues'
>;

export function toDomain<T extends Model>(entity: T): ModelData<T> {
  return entity.get({ plain: true });
}

export function toDomainArray<T extends Model>(entities: T[]): ModelData<T>[] {
  return entities.map(toDomain);
}
