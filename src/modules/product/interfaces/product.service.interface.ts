import { CreateProductDto } from '@product/dto/create-product.dto';
import { UpdateProductDto } from '@product/dto/update-product.dto';
import { Product } from '@product/schemas/product.schema';

export interface IProductService {
  create(createProductDto: CreateProductDto): Promise<CreateProductDto>;
  findAll(): Promise<CreateProductDto[]>;
  findById(id: string): Promise<Product>;
  update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
  remove(id: string): Promise<void>;
}
