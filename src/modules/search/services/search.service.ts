import { Pagination } from '@shared/decorators/pagination.decorator';
import { FilterQuery, Model, Document } from 'mongoose';

export class SearchService<T extends Document> {
  public constructor(private readonly model: Model<T>) { }

  public async searchWithPaginationAndFilters(
    pagination: Pagination,
    filters: Record<string, any> = {},
  ): Promise<T[]> {
    return this.paginateAndLean(filters, pagination);
  }

  public async searchWithPaginationAndText(
    pagination: Pagination,
    text: string,
  ): Promise<T[]> {
    const searchQuery = {
      $text: { $search: text },
    } as FilterQuery<T>;

    return this.paginateAndLean(searchQuery, pagination);
  }

  private async paginateAndLean(
    query: FilterQuery<T>,
    { limit, offset }: Pagination,
  ): Promise<T[]> {
    return await this.model
      .find(query)
      .select('name')
      .skip(offset)
      .limit(limit)
      .lean();
  }
}
