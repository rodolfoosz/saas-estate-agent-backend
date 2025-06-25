import {
  Controller, Get, Post, Body, Param, Patch, Delete,
  Query,
} from '@nestjs/common';
import { ProductDto } from './dto/products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: ProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  search(@Query('term') term: string) {
    return this.productsService.search(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
