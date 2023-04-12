import { DepositType } from "src/enums/deposit-type";

export class CreateDepositsRequestDTO {
    userId: string;
    type: DepositType;
    amount: number;
    periodInMonths: number;
  }