import { Controller, Get, Query } from '@nestjs/common';
import { GetDepositsRequestDTO } from '../dto/get-deposits-request.dto';
import { DepositsService } from '../service/deposits.service';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}


  @Get()
  async findAll(@Query() query: GetDepositsRequestDTO): Promise<any[]> {
    console.log(query);
    return this.depositsService.getAllDeposits(query.userId);
  }
}
