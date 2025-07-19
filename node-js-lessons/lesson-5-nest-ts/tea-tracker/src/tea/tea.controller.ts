import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Body,
  HttpCode,
} from '@nestjs/common';
import { TeaService } from './tea.service';
import { CreateTeaDto, UpdateTeaDto } from './dto/tea.dto';
import { ZBody } from '../common/decorators/z-body.decorator';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { Public } from '../common/decorators/public.decorator';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import {
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTeaDto as SwaggerCreateDto } from './dto/create-tea.dto';
import { UpdateTeaDto as SwaggerUpdateDto } from './dto/update-tea.dto';

@UseGuards(ApiKeyGuard)
@ApiTags('tea')
@UseInterceptors(LoggingInterceptor)
@Controller('tea')
export class TeaController {
  constructor(private readonly teaService: TeaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all teas with optional filters' })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async findAll(
    @Query('minRating') minRating = 0,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.teaService.findAll(+minRating, +page, +pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tea by ID' })
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id') id: string) {
    return this.teaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new tea' })
  @ApiBody({ type: SwaggerCreateDto })
  @ApiResponse({ status: 201, description: 'Created' })
  async create(@ZBody(CreateTeaDto) dto: SwaggerCreateDto) {
    return this.teaService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing tea' })
  @ApiBody({ type: SwaggerUpdateDto })
  async update(
    @Param('id') id: string,
    @ZBody(UpdateTeaDto) dto: SwaggerUpdateDto,
  ) {
    return this.teaService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tea' })
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return this.teaService.delete(id);
  }
}
