import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, IsNull, Repository, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from 'src/entities/user.entity';
import { Deposit } from 'src/entities/deposit.entity';

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
        where: {user : retrivedUser}
    })
    return deposit;
  }
}
