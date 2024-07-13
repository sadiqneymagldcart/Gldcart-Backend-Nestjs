import { Injectable, Type } from '@nestjs/common';
import {
  ClassSerializerInterceptor,
  ClassSerializerInterceptorOptions,
  PlainLiteralObject,
} from '@nestjs/common/serializer';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';
import mongoose from 'mongoose';

@Injectable()
export class MongooseClassSerializerInterceptor extends ClassSerializerInterceptor {
  public constructor(
    protected readonly reflector: Reflector,
    protected readonly defaultOptions: ClassSerializerInterceptorOptions = {},
  ) {
    super(reflector, defaultOptions);
  }

  private _changePlainObjectToInstance(
    object: PlainLiteralObject,
    classToIntercept: Type,
  ) {
    if (object instanceof mongoose.Document) {
      return plainToInstance(classToIntercept, object.toJSON());
    }
    return object;
  }

  private _prepareResponse(
    response: PlainLiteralObject | PlainLiteralObject[],
    classToIntercept: Type,
  ) {
    if (Array.isArray(response)) {
      return response.map((document: Document) =>
        this._changePlainObjectToInstance(document, classToIntercept),
      );
    }
    return this._changePlainObjectToInstance(response, classToIntercept);
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
            this._prepareResponse(response, classToIntercept),
            this.defaultOptions,
          ),
        ),
      );
  }
}
