import { DepositType } from "src/enums/deposit-type";
import { Column, Entity, PrimaryGeneratedColumn,JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity("deposit")
export class Deposit {
    @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "type", nullable: false})
  type: DepositType;

  @Column({ name: "deposit_amount", nullable: false})
  depositAmount: number;

  @Column({ name: "maturity_amount", nullable: false})
  maturityAmount: number;

  @Column({ name: "date_of_deposit", nullable: false})
  dateOfDeposit: Date;

  @Column({ name: "date_of_maturity", nullable: false})
  dateOfMaturity: Date;

  @Column({ name: "rate_of_interest", nullable: false})
  rateOfInterest: number;

  @Column({ name: "account_number", nullable: false})
  accountNumber: number;

  @Column({ name: "is_deleted", nullable: false})
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
