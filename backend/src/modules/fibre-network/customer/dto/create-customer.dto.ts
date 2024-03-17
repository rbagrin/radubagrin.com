import { CreateCustomer } from '../customer.interface';
import { Exclude, Expose } from 'class-transformer';
import {
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

@Exclude()
export class CreateCustomerDto implements CreateCustomer {
  @IsNotEmpty()
  @IsString()
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  address: string;

  @IsNotEmpty()
  @IsString()
  @Expose()
  postcode: string;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  longitude: number;

  @IsNotEmpty()
  @IsJSON()
  @Expose()
  geom: {
    coordinates: number[];
    type: 'Point';
    crs: Record<string, unknown>;
  };

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  capacity: number;

  @IsOptional()
  @IsUUID()
  @Expose()
  chamberId: string | null;
}
