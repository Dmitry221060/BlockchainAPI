import { Module } from "@nestjs/common";
import { EVMController } from "./evm.controller";
import { EVMService } from "./evm.service";
import { RpcProvider } from "./rpc.provider";

@Module({
  controllers: [EVMController],
  providers: [EVMService, RpcProvider.forRoot()],
})
export class EVMModule {}
