import { Customer } from '../customer.interface';
import {
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class CustomerDto implements Customer {
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  id: string;

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

  @IsNotEmpty()
  @IsDate()
  @Expose()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Expose()
  updatedAt: Date;
}
