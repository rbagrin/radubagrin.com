import { ModelData } from '../../../infra/db/postgres/postgres-config/postgres.util';
import { ChamberEntity } from './chamber.entity';

export type Chamber = ModelData<ChamberEntity>;
