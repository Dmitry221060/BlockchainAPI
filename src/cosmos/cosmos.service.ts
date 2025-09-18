import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { toHex } from "@cosmjs/encoding";
import {
  BlockResponse,
  connectComet,
  toRfc3339WithNanoseconds,
} from "@cosmjs/tendermint-rpc";
import { StargateClient } from "@cosmjs/stargate";
import { Fee } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { CosmosBlockDto } from "./dto/cosmos-block.dto";
import { CosmosTransactionDto } from "./dto/cosmos-transaction.dto";

@Injectable()
export class CosmosService extends StargateClient implements OnModuleDestroy {
  private defaultFee: string = "0";

  static forRootAsync() {
    return {
      provide: CosmosService,
      useFactory: async (configService: ConfigService) => {
        const endpoint = configService.getOrThrow<string>("COSMOS_RPC_NODE");
        const cometClient = await connectComet(endpoint);
        return new CosmosService(cometClient, {});
      },
      inject: [ConfigService],
    };
  }

  async findBlock(height: number): Promise<CosmosBlockDto> {
    let response: BlockResponse;
    try {
      response = await this.forceGetCometClient().block(height);
    } catch (e) {
      let innerError: { code?: number; data?: string } = {};
      try {
        innerError = JSON.parse((e as Error).message) as object;
      } catch {
        //...
      }

      if (innerError?.code == -32603)
        throw new BadRequestException(innerError?.data);

      throw new InternalServerErrorException();
    }

    const blockDto = new CosmosBlockDto();
    blockDto.height = response.block.header.height;
    blockDto.time = toRfc3339WithNanoseconds(response.block.header.time);
    blockDto.hash = toHex(response.blockId.hash).toUpperCase();
    blockDto.proposedAddress = toHex(
      response.block.header.proposerAddress,
    ).toUpperCase();

    return blockDto;
  }

  async findTransaction(hash: string): Promise<CosmosTransactionDto> {
    let response;
    try {
      response = await this.forceGetQueryClient().tx.getTx(hash);
    } catch {
      throw new BadRequestException();
    }

    const txR = response.txResponse;
    if (response == null || txR == null) throw new BadRequestException();
    const sign =
      response.tx?.authInfo?.signerInfos[0].publicKey?.value ??
      new Uint8Array();
    const feeData = response.tx?.authInfo?.fee;
    const fee = feeData ? this.calculateFee(feeData) : this.defaultFee;

    const transactionDto = new CosmosTransactionDto();
    transactionDto.hash = txR.txhash;
    transactionDto.height = Number(txR.height);
    transactionDto.time = txR.timestamp;
    transactionDto.gasUsed = txR.gasUsed.toString();
    transactionDto.gasWanted = txR.gasWanted.toString();
    transactionDto.fee = fee;
    transactionDto.sender = toHex(sign).toUpperCase();

    return transactionDto;
  }

  private calculateFee(feeData: Fee): string {
    const gas = Number(feeData.gasLimit);
    const amount = Number(feeData.amount[0].amount);
    return `${gas * amount} ${feeData.amount[0].denom}`;
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
