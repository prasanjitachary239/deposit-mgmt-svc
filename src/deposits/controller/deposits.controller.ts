import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreateDepositsRequestDTO } from '../dto/create-deposits-request.dto';
import { DeleteDepositsRequestDTO } from '../dto/delete-deposits-request.dto';
import { GetDepositsRequestDTO } from '../dto/get-deposits-request.dto';
import { DepositsService } from '../service/deposits.service';

@Controller('deposits')
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}


  @Get()
  async findAll(@Query() query: GetDepositsRequestDTO): Promise<any[]> {
    return this.depositsService.getAllDeposits(query.userId);
  }


  @Post()
  async addCluster(
    @Body() createDepositRequestDTO: CreateDepositsRequestDTO
  ) {
    return this.depositsService.addDeposit(createDepositRequestDTO);
  }

  @Delete()
  async closeDeposit(@Query() query: DeleteDepositsRequestDTO){
    return this.depositsService.closeDeposit(query.accountNumber);
  }
}
