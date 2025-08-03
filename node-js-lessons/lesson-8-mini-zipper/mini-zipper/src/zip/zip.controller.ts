import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZipService } from './zip.service.js';
import { TMP_DIR_ZIPS } from '../system/constants.js';

@Controller('zip')
export class ZipController {
  constructor(private readonly zipService: ZipService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('zip', {
      dest: TMP_DIR_ZIPS,
    }),
  )
  async handleZip(@UploadedFile() file: Express.Multer.File) {
    return this.zipService.processZip(file.path);
  }
}
