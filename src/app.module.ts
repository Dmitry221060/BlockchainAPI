import { Module } from "@nestjs/common";
import { CosmosModule } from "./cosmos/cosmos.module";
import { EVMModule } from "./evm/evm.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    CosmosModule,
    EVMModule,
    HealthModule,
  ],
})
export class AppModule {}
