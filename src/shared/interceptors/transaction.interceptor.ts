import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Observable, catchError, tap } from 'rxjs';
import mongoose from 'mongoose';

export class TransactionInterceptor implements NestInterceptor {
  public constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  public async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const session: mongoose.ClientSession =
      await this.connection.startSession();

    request.mongooseSession = session;

    session.startTransaction();
    return next.handle().pipe(
      tap(() => this.commitTransaction(session)),
      catchError((error) => this.abortTransaction(session, error)),
    );
  }

  private async commitTransaction(session: mongoose.ClientSession) {
    await session.commitTransaction();
    await session.endSession();
  }

  private async abortTransaction(session: mongoose.ClientSession, error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
}
