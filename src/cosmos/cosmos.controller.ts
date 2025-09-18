import { Get, Controller, Param } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { CosmosService } from "./cosmos.service";
import { CosmosBlockDto } from "./dto/cosmos-block.dto";
import { CosmosTransactionDto } from "./dto/cosmos-transaction.dto";

@Controller("cosmos")
export class CosmosController {
  constructor(private readonly cosmosService: CosmosService) {}

  @Get("/block/:height")
  @ApiOperation({ summary: "Get block info by block height" })
  async findBlock(@Param("height") height: number): Promise<CosmosBlockDto> {
    return this.cosmosService.findBlock(height);
  }

  @Get("/transactions/:hash")
  @ApiOperation({ summary: "Get block info by block height" })
  async findTransaction(
    @Param("hash") hash: string,
  ): Promise<CosmosTransactionDto> {
    return this.cosmosService.findTransaction(hash);
  }
}
