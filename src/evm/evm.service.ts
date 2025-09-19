import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
} from "@nestjs/common";
import { JsonRpcError, JsonRpcProvider } from "ethers";
import { EVMBlockDto } from "./dto/evm-block.dto";
import { EVMTransactionDto } from "./dto/evm-transaction.dto";

@Injectable()
export class EVMService implements OnModuleDestroy {
  constructor(private provider: JsonRpcProvider) {}

  async findBlock(height: number): Promise<EVMBlockDto> {
    let block: EVMBlockDto & { number: string };
    try {
      const hexHeight = `0x${height.toString(16)}`;
      block = (await this.provider.send("eth_getBlockByNumber", [
        hexHeight,
        false,
      ])) as EVMBlockDto & { number: string };
    } catch (e) {
      if ((e as JsonRpcError).error?.code == -32602)
        throw new BadRequestException((e as JsonRpcError)?.error?.message);

      throw new InternalServerErrorException();
    }

    if (block == null) throw new BadRequestException();

    const blockDto = new EVMBlockDto();
    blockDto.height = parseInt(block.number, 16);
    blockDto.hash = block.hash;
    blockDto.parentHash = block.parentHash;
    blockDto.gasLimit = block.gasLimit;
    blockDto.gasUsed = block.gasUsed;
    blockDto.size = block.size;

    return blockDto;
  }

  async findTransaction(hash: string): Promise<EVMTransactionDto> {
    let transaction: EVMTransactionDto;
    try {
      transaction = (await this.provider.send("eth_getTransactionByHash", [
        hash,
      ])) as EVMTransactionDto;
    } catch (e) {
      if ((e as JsonRpcError).error?.code == -32602)
        throw new BadRequestException((e as JsonRpcError)?.error?.message);

      throw new InternalServerErrorException();
    }

    if (transaction == null) throw new BadRequestException();

    const transactionDto = new EVMTransactionDto();
    transactionDto.hash = transaction.hash;
    transactionDto.to = transaction.to;
    transactionDto.from = transaction.from;
    transactionDto.value = transaction.value;
    transactionDto.input = transaction.input;
    transactionDto.maxFeePerGas = transaction.maxFeePerGas;
    transactionDto.maxPriorityFeePerGas = transaction.maxPriorityFeePerGas;
    transactionDto.gasPrice = transaction.gasPrice;

    return transactionDto;
  }

  onModuleDestroy() {
    this.provider?.destroy();
  }
}
