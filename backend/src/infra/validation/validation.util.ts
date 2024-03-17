import * as yup from 'yup';
import { BadRequestException } from '@nestjs/common';

export async function validateInput(
  data: object,
  schema: yup.ObjectSchema<object>,
): Promise<void> {
  if (!schema) throw new BadRequestException('Validation schema is missing');
  try {
    await schema.validate(data);
  } catch (error) {
    console.error(error);
    throw new BadRequestException(error.message);
  }
}
