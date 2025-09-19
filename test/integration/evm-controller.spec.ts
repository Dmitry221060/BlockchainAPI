import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Server } from "http";
import request from "supertest";
import { JsonRpcProvider } from "ethers";
import { createApp, CreateAppOptions } from "../utils/create-app";

describe("EVM", () => {
  let app: INestApplication;
  let server: Server;
  let mockedRpcProvider: JsonRpcProvider;

  beforeAll(async () => {
    const options: CreateAppOptions = {
      moduleBuilderHook: (moduleRef) =>
        moduleRef.overrideProvider(JsonRpcProvider).useFactory({
          factory: (configService: ConfigService) => {
            mockedRpcProvider = new JsonRpcProvider(
              configService.getOrThrow<string>("EVM_RPC_NODE"),
            );
            return mockedRpcProvider;
          },
          inject: [ConfigService],
        }),
    };

    app = await createApp(options);
    server = app.getHttpServer();
  });

  describe("/block", () => {
    const testBlock = {
      height: 168806208,
      hash: "0x00ecf9ad84331b4bd6dd51efdeaae72dc61fe5d41a14eeb3f3f2714cf4ec1d85",
      parentHash:
        "0x659dca64611d7e821c37233c9a6f0ce517871d73ccddf3b8859573c024d449f0",
      gasLimit: "0x989680",
      gasUsed: "0x55566",
      size: "0x5d9e",
    };

    it("returns block info for valid block number", async () => {
      const response = await request(server)
        .get(`/evm/block/${testBlock.height}`)
        .expect(200);

      const block = response.body;
      expect(block).not.toBeNull();
      expect(block.height).toBe(testBlock.height);
      expect(block.hash).toBe(testBlock.hash);
      expect(block.parentHash).toBe(testBlock.parentHash);
      expect(block.gasLimit).toBe(testBlock.gasLimit);
      expect(block.gasUsed).toBe(testBlock.gasUsed);
      expect(block.size).toBe(testBlock.size);
    });

    it("returns block info in just 1 query", async () => {
      const spy = jest.spyOn(mockedRpcProvider, "_send");
      await request(server).get(`/evm/block/${testBlock.height}`).expect(200);

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it("returns 400 for invalid block number", async () => {
      return request(server).get(`/evm/block/-9999999`).expect(400);
    });
  });

  describe("/transactions", () => {
    const testTransaction = {
      hash: "0x1012ef8fe2f61da08d3a2c053d38dbaed3b8f9d3b2eb6a39494be2f7c06fcd3a",
      to: "0x6fe71679b11eee2d5b079e263d4e580a80625e93",
      from: "0x15684d42685adbc9ab59e0b02c01c1d1a28565fe",
      value: "0x0",
      input:
        "0x6c05cd2b02e15fc38f6d8c56af07bbcbe3baf5708a2bf423920f424020038aac60e1d17ce2229812eca8ee7800214baffc000f41d70f424020a77dd803b597e2b9744bcf1ed62755a2bfa686d9010f36830000000000000000000b22b1f4870f3800000000000001b4384c592fb74f2d43",
      maxFeePerGas: "0x2ff223f04",
      maxPriorityFeePerGas: "0x2ff223f04",
      gasPrice: "0x2ff223f04",
    };

    it("returns transaction info for valid hash", async () => {
      const response = await request(server)
        .get(`/evm/transactions/${testTransaction.hash}`)
        .expect(200);

      const transaction = response.body;
      expect(transaction).not.toBeNull();
      expect(transaction.hash).toBe(testTransaction.hash);
      expect(transaction.to).toBe(testTransaction.to);
      expect(transaction.from).toBe(testTransaction.from);
      expect(transaction.value).toBe(testTransaction.value);
      expect(transaction.input).toBe(testTransaction.input);
      expect(transaction.maxFeePerGas).toBe(testTransaction.maxFeePerGas);
      expect(transaction.maxPriorityFeePerGas).toBe(
        testTransaction.maxPriorityFeePerGas,
      );
      expect(transaction.gasPrice).toBe(testTransaction.gasPrice);
    });

    it("returns 400 for invalid transaction hash", async () => {
      return request(server).get(`/evm/transactions/invalidHash`).expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
