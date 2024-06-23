import { Injectable } from '@nestjs/common';
import { Pagination } from '@shared/decorators/pagination.decorator';
import { In, ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SearchService<T extends ObjectLiteral> {
  private readonly repository: Repository<T>;

  public constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  public async searchWithPaginationAndText(
    { limit, offset }: Pagination,
    searchFields: Extract<keyof T, string>[],
    search: string,
  ): Promise<[T[], number]> {
    const queryBuilder = this.repository.createQueryBuilder('alias');
    this.applySearchConditions(queryBuilder, searchFields, search);

    queryBuilder.skip(offset).take(limit);

    return await queryBuilder.getManyAndCount();
  }

  public async searchWithPaginationAndFilters(
    { limit, offset }: Pagination,
    filters: ObjectLiteral,
  ): Promise<[T[], number]> {
    const queryBuilder = this.createQueryBuilderWithWhere(filters);

    queryBuilder.skip(offset).take(limit);

    return await queryBuilder.getManyAndCount();
  }

  private applySearchConditions(
    queryBuilder: SelectQueryBuilder<T>,
    searchFields: Extract<keyof T, string>[],
    search: string,
  ): void {
    const likeConditions = searchFields.map(
      (field) => `LOWER(${field}) LIKE LOWER(:search)`,
    );
    const searchCondition = likeConditions.join(' OR ');

    queryBuilder.andWhere(`(${searchCondition})`, { search: `%${search}%` });
  }

  private createQueryBuilderWithWhere(
    filters: ObjectLiteral,
  ): SelectQueryBuilder<T> {
    const where = this.buildWhereClause(filters);
    return this.repository.createQueryBuilder('alias').where(where);
  }

  private buildWhereClause(filters: ObjectLiteral): ObjectLiteral {
    const where: ObjectLiteral = {};

    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        where[key] = Array.isArray(filters[key])
          ? In(filters[key])
          : filters[key];
      }
    }
    return where;
  }
}
