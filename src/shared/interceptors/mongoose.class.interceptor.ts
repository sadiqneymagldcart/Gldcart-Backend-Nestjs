import { Reflector } from '@nestjs/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Type,
} from '@nestjs/common';
import {
  ClassSerializerInterceptor,
  ClassSerializerInterceptorOptions,
  PlainLiteralObject,
} from '@nestjs/common/serializer';
import { Observable } from 'rxjs';
import mongoose from 'mongoose';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MongooseClassSerializerInterceptor extends ClassSerializerInterceptor {
  public constructor(
    protected readonly reflector: Reflector,
    protected readonly defaultOptions: ClassSerializerInterceptorOptions = {},
  ) {
    super(reflector, defaultOptions);
  }

  private changePlainObjectToInstance(
    object: PlainLiteralObject,
    classToIntercept: Type,
  ) {
    if (object instanceof mongoose.Document) {
      return plainToInstance(classToIntercept, object.toJSON());
    }
    return object;
  }

  private prepareResponse(
    response: PlainLiteralObject | PlainLiteralObject[],
    classToIntercept: Type,
  ) {
    if (Array.isArray(response)) {
      return response.map((document: Document) =>
        this.changePlainObjectToInstance(document, classToIntercept),
      );
    }
    return this.changePlainObjectToInstance(response, classToIntercept);
  }

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const classToIntercept = this.reflector.get<Type>(
      'classToIntercept',
      context.getClass(),
    );

    return next
      .handle()
      .pipe(
        map((response) =>
          this.serialize(
            this.prepareResponse(response, classToIntercept),
            this.defaultOptions,
          ),
        ),
      );
  }
}
