import { Module } from '@nestjs/common';
import { SearchService } from './services/search.service';

@Module({
  exports: [SearchService],
})
export class SearchModule { }
