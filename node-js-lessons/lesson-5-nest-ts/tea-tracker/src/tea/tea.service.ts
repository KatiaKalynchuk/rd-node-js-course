import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateTeaDto as SwaggerCreateDto } from './dto/create-tea.dto';
import { UpdateTeaDto as SwaggerUpdateDto } from './dto/update-tea.dto';

export type Tea = {
  id: string;
  name: string;
  origin: string;
  rating?: number;
  brewTemp?: number;
  notes?: string;
};

@Injectable()
export class TeaService {
  private teas: Tea[] = [];

  async create(dto: SwaggerCreateDto): Promise<Tea> {
    const tea: Tea = { id: randomUUID(), ...dto };
    this.teas.push(tea);
    return tea;
  }

  async findAll(
    minRating = 0,
    page = 1,
    pageSize = 10,
  ): Promise<{
    data: Tea[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const filtered = this.teas.filter(
      (item) => !item.rating || item.rating >= minRating,
    );
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      data: paginated,
      total: filtered.length,
      page,
      pageSize,
    };
  }

  async findOne(id: string): Promise<Tea> {
    const tea = this.teas.find((item) => item.id === id);

    if (!tea) {
      throw new NotFoundException('Tea not found');
    }

    return tea;
  }

  async update(id: string, dto: SwaggerUpdateDto): Promise<Tea> {
    const index = this.teas.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Tea not found');
    }

    this.teas[index] = { ...this.teas[index], ...dto };
    return this.teas[index];
  }

  async delete(id: string): Promise<void> {
    const index = this.teas.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException('Tea not found');
    }

    this.teas.splice(index, 1);
  }
}
