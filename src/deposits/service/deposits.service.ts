import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, IsNull, Repository, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from 'src/entities/user.entity';
import { Deposit } from 'src/entities/deposit.entity';
import { CreateDepositsRequestDTO } from '../dto/create-deposits-request.dto';
import { randomUUID } from 'crypto';
import { DepositType } from 'src/enums/deposit-type';

@Injectable()
export class DepositsService {
  constructor(
    @InjectRepository(Deposit)
    private readonly depositRepository: Repository<Deposit>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getAllDeposits(userId: string) {
    const retrivedUser =await this.userRepository.findOne({where: {id : userId}})
    if(!retrivedUser){
        throw new NotFoundException(`The provided user id ${userId} does not exist`);
    }
    const deposit = await this.depositRepository.find({
        where: {user : retrivedUser, isDeleted: false}
    })
    return deposit;
  }

  async addDeposit(createDepositDto: CreateDepositsRequestDTO){
    const deposit = new Deposit();
    const retrivedUser = await this.userRepository.findOne({where: {id : createDepositDto.userId}})
    if(!retrivedUser){
      throw new NotFoundException(`The provided user id ${createDepositDto.userId} does not exist`);
    }
    deposit.user = retrivedUser;
    deposit.dateOfDeposit = new Date();
    deposit.depositAmount = createDepositDto.amount;
    deposit.id = randomUUID();
    deposit.dateOfMaturity = new Date();
    deposit.dateOfMaturity.setMonth(deposit.dateOfMaturity.getMonth()+createDepositDto.periodInMonths);
    deposit.isDeleted = false;
    deposit.accountNumber = Math.floor(Math.random()*1E16);
    deposit.rateOfInterest = this.calculateRateOfInterest(createDepositDto.periodInMonths);
    deposit.type = createDepositDto.type;
    deposit.maturityAmount = this.calculateMaturtityAmount(createDepositDto.amount, deposit.rateOfInterest, createDepositDto.periodInMonths, createDepositDto.type);
    try{
      const createdDeposit = await this.depositRepository.save(deposit);
      return createdDeposit;
    }catch(e){
      console.log(e);
      throw new InternalServerErrorException("Something went wrong while saving the deposit");
    }
    
  }

  //just soft deleting the record by setting isDeleted column to true
  async closeDeposit(depositAccountNumber: number) {
    const retrivedDeposit = await this.depositRepository.findOne({where: {accountNumber : depositAccountNumber}})
    if(!retrivedDeposit){
      throw new NotFoundException(`account with account number: ${depositAccountNumber} not found`)
    }
    retrivedDeposit.isDeleted = true;
    retrivedDeposit.dateOfMaturity = new Date();
    const dateOfDeposit = retrivedDeposit.dateOfDeposit;
    const totalMonthsOfInvestment =retrivedDeposit.dateOfMaturity.getMonth() - dateOfDeposit.getMonth();
    retrivedDeposit.rateOfInterest = this.calculateRateOfInterest(totalMonthsOfInvestment);
    retrivedDeposit.maturityAmount = this.calculateMaturtityAmount(retrivedDeposit.depositAmount, retrivedDeposit.rateOfInterest, totalMonthsOfInvestment, retrivedDeposit.type);
    try{
      const deletedDeposit = await this.depositRepository.save(retrivedDeposit);
      return deletedDeposit;
    }catch(e){
      console.log(e);
      throw new InternalServerErrorException(`Something went wrong while deleting the record`);
    }
    
  }

  calculateMaturtityAmount(amount: number, rateOfInterest: number, periodInMonths: number, type: DepositType): number {
    const period:string = (periodInMonths/12).toPrecision(3);
    if(type === Object.values(DepositType)[0]){
      return amount + ((amount*rateOfInterest)/100)*parseFloat(period);
    }else{
      const interest = (amount*(1+(rateOfInterest/100)*Math.ceil(parseFloat(period))*parseFloat(period)));
      return (amount*periodInMonths)+interest;
    }
    
  }

  calculateRateOfInterest(periodInMonths: number): number {
    if(periodInMonths <= 6){
      return 5;
    }else if(periodInMonths <= 12){
      return 6;
    }else{
      return 7;
    }
  }
}
