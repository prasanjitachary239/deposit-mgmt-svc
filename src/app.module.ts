import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepositsController } from './deposits/controller/deposits.controller';
import { DepositsService } from './deposits/service/deposits.service';
import { DepositsModule } from './deposits/module/deposits.module';
import { User } from './entities/user.entity';
import { Deposit } from './entities/deposit.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "admin",
      database: "deposit",
      entities: [Deposit,User],
      synchronize: false,
    }), DepositsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
