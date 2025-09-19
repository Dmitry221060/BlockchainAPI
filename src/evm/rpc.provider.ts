import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonRpcProvider } from "ethers";

@Injectable()
export class RpcProvider {
  static forRoot() {
    return {
      provide: JsonRpcProvider,
      useFactory: (configService: ConfigService) => {
        return new JsonRpcProvider(
          configService.getOrThrow<string>("EVM_RPC_NODE"),
        );
      },
      inject: [ConfigService],
    };
  }
}
