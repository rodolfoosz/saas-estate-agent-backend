export class ProductDto {
  id?: string;
  title: string;
  description?: string;
  price: number;
  category?: string;
  tags?: string[];
  location?: string;
  images?: string[];
  rating?: number;
  attributes: Record<string, string | number | boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}
