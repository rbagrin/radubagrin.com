import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { validateSync } from 'class-validator';

interface ClassType<T> {
  new (): T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<Partial<T>, T> {
  constructor(private readonly classType: ClassType<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<Partial<T>>,
  ): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        const instance = plainToInstance(this.classType, data, {
          excludePrefixes: ['_'],
          excludeExtraneousValues: true,
        });

        const errors = validateSync(instance as object);
        if (errors.length > 0) {
          const errorMessages = errors
            .map((error) => Object.values(error.constraints))
            .flat();
          throw new BadRequestException(errorMessages.join(', '));
        }

        return instance;
      }),
    );
  }
}
