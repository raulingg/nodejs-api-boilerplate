import type { CustomHelpers } from 'joi';
import { isValidObjectId } from 'mongoose';

export const objectId = (value: string, helper: CustomHelpers) => {
  if (isValidObjectId(value)) {
    return value;
  }

  return helper.error('any.invalid');
};
