import { Pagination } from '@shared/decorators/pagination.decorator';
import { FilterQuery, Model, Document } from 'mongoose';

const CASE_INSENSITIVE_OPTION = 'i';

export class SearchService<T extends Document> {
  public constructor(private readonly model: Model<T>) {}

  public async searchWithPaginationAndFilters(
    { limit, offset }: Pagination,
    filters: Record<string, any> = {},
  ): Promise<T[]> {
    return this.model.find(filters).skip(offset).limit(limit).lean();
  }

  public async searchWithPaginationAndText(
    { limit, offset }: Pagination,
    searchFields: (keyof T)[],
    text: string,
  ): Promise<T[]> {
    if (searchFields.length === 0) {
      throw new Error('searchFields cannot be empty');
    }

    const searchQuery = {
      $or: searchFields.map((field) => ({
        [field]: { $regex: text, $options: CASE_INSENSITIVE_OPTION },
      })),
    } as FilterQuery<T>;

    return this.model.find(searchQuery).skip(offset).limit(limit).lean();
  }
}
