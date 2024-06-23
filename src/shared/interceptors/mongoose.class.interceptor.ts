import { Injectable, Type } from '@nestjs/common';
import {
        ClassSerializerInterceptor,
        ClassSerializerInterceptorOptions,
        PlainLiteralObject,
} from '@nestjs/common/serializer';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Document } from 'mongoose';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MongooseClassSerializerInterceptor extends ClassSerializerInterceptor {
        protected readonly reflector: Reflector;
        protected readonly defaultOptions: ClassSerializerInterceptorOptions = {};
        public constructor(
                reflector: Reflector,
                defaultOptions: ClassSerializerInterceptorOptions = {},
        ) {
                super(reflector, defaultOptions);
                this.reflector = reflector;
                this.defaultOptions = defaultOptions;
        }

        private _changePlainObjectToInstance(
                object: PlainLiteralObject,
                classToIntercept: Type<any>,
        ) {
                if (!(object instanceof Document)) {
                        return object;
                }
                return plainToInstance(classToIntercept, object.toJSON());
        }

        private _prepareResponse(
                response: PlainLiteralObject | PlainLiteralObject[],
                classToIntercept: Type<any>,
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
                const classToIntercept = this.reflector.get<Type<any>>(
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
