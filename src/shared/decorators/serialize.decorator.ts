import { SetMetadata, Type } from '@nestjs/common';

export const SerializeWith = (classToIntercept: Type<any>) =>
    SetMetadata('classToIntercept', classToIntercept);
