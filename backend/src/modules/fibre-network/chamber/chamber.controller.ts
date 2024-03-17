import { Controller, Get } from '@nestjs/common';
import { ChamberService } from './chamber.service';

@Controller('/chambers')
export class ChamberController {
  constructor(private readonly chamberService: ChamberService) {}

  @Get('/')
  async getAll(): Promise<any> {
    return this.chamberService.findAll();
  }
}
