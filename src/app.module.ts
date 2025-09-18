import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CosmosModule } from "./cosmos/cosmos.module";
import { EVMModule } from "./evm/evm.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CosmosModule,
    EVMModule,
    HealthModule,
  ],
})
export class AppModule {}
