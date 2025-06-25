import { InputJsonValue } from "@prisma/client/runtime/library";

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
  attributes: InputJsonValue;
  createdAt?: Date;
  updatedAt?: Date;
}
