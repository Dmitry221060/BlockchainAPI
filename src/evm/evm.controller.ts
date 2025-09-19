import { Controller, Get, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { EVMService } from "./evm.service";
import { EVMBlockDto } from "./dto/evm-block.dto";
import { EVMTransactionDto } from "./dto/evm-transaction.dto";

@Controller("evm")
export class EVMController {
  constructor(private readonly evmService: EVMService) {}

  @Get("/block/:height")
  @ApiOperation({ summary: "Get block info by block height" })
  async findBlock(@Param("height") height: number): Promise<EVMBlockDto> {
    return this.evmService.findBlock(height);
  }

  @Get("/transactions/:hash")
  @ApiOperation({ summary: "Get block info by block height" })
  async findTransaction(
    @Param("hash") hash: string,
  ): Promise<EVMTransactionDto> {
    return this.evmService.findTransaction(hash);
  }
}
