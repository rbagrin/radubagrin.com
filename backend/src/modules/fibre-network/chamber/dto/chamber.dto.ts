import {
  IsDate,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { Chamber } from '../chamber.interface';

export class ChamberDto implements Chamber {
  @IsNotEmpty()
  @IsString()
  @Expose()
  id: string;

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
  totalCapacity: number;

  @IsNotEmpty()
  @IsNumber()
  @Expose()
  usedCapacity: number;

  @IsNotEmpty()
  @IsDate()
  @Expose()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  @Expose()
  updatedAt: Date;
}
