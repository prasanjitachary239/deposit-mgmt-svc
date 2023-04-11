import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deposit } from 'src/entities/deposit.entity';
import { User } from 'src/entities/user.entity';
import { DepositsController } from '../controller/deposits.controller';
import { DepositsService } from '../service/deposits.service';

@Module({
  controllers: [DepositsController],
  providers: [DepositsService],
  imports: [TypeOrmModule.forFeature([Deposit, User])],
  exports: [DepositsService],
})
export class DepositsModule {}
