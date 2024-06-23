import {
        ClassSerializerInterceptor,
        PlainLiteralObject,
        Type,
} from '@nestjs/common';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';
import { Document } from 'mongoose';

export function MongooseClassSerializerInterceptor(
        classToIntercept: Type,
): typeof ClassSerializerInterceptor {
        return class Interceptor extends ClassSerializerInterceptor {
                private _changePlainObjectToInstance(document: PlainLiteralObject) {
                        if (!(document instanceof Document)) {
                                return document;
                        }

                        return plainToInstance(classToIntercept, document.toJSON());
                }

                private _prepareResponse(
                        response: PlainLiteralObject | PlainLiteralObject[],
                ) {
                        if (Array.isArray(response)) {
                                return response.map(this._changePlainObjectToInstance);
                        }

                        return this._changePlainObjectToInstance(response);
                }

                public serialize(
                        response: PlainLiteralObject | PlainLiteralObject[],
                        options: ClassTransformOptions,
                ) {
                        return super.serialize(this._prepareResponse(response), options);
                }
        };
}
