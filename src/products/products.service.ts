import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(ProductsService.name)

  async create(data: ProductDto) {
    return this.prisma.product.create({ data });
  }

  async findAll() {
    try{
      return this.prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('Erro ao buscar produtos', error.stack);
      throw error;
    }
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Produto não encontrado');
    return product;
  }

  async update(id: string, data: ProductDto) {
    return this.prisma.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

async search(term: string): Promise<ProductDto[]> {
  const allProducts = await this.findAll();

  return allProducts
    .map(product => {
      const normalizedAttributes =
        typeof product.attributes === 'object' &&
        !Array.isArray(product.attributes)
          ? (product.attributes as Record<string, string | number | boolean>)
          : {};

      return {
        ...product,
        description: product.description ?? '',
        category: product.category ?? '',
        location: product.location ?? '',
        rating: product.rating ?? 1,
        attributes: normalizedAttributes,
      };
    })
    .filter(product => {
      const lower = term.toLowerCase();
      return (
        product.title.toLowerCase().includes(lower) ||
        product.description.toLowerCase().includes(lower)
      );
    });
  }

}
