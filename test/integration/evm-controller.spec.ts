import { INestApplication, NotImplementedException } from "@nestjs/common";
import { Server } from "http";
import request from "supertest";
import { createApp } from "../utils/create-app";

describe("EVM", () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    app = await createApp();
    server = app.getHttpServer();
  });

  describe("/block", () => {
    let testBlock = {
      height: 1,
      hash: "hash",
      parentHash: "hash",
      gasLimit: 0,
      gasUsed: 0,
      size: 0
    };

    it("returns block info for valid block number", async () => {
      const response = await request(server)
        .get(`/block/${testBlock.height}`)
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
      throw new NotImplementedException("Mock implementation");
    });

    it("returns 400 for invalid block number", async () => {
      return request(server)
        .get(`/block/-9999999`)
        .expect(400);
    });
  });

  describe("/transactions", () => {
    const testTransaction = {
      hash: "hash",
      to: "address",
      from: "address",
      value: "value",
      input: "input",
      maxFeePerGas: 0,
      maxPriotityFeePerGas: 0,
      gasPrice: 0,
    };

    it("returns transaction info for valid hash", async () => {
      const response = await request(server)
        .get(`/transactions/${testTransaction.hash}`)
        .expect(200);

      const transaction = response.body;
      expect(transaction).not.toBeNull();
      expect(transaction.hash).toBe(testTransaction.hash);
      expect(transaction.to).toBe(testTransaction.to);
      expect(transaction.from).toBe(testTransaction.from);
      expect(transaction.value).toBe(testTransaction.value);
      expect(transaction.input).toBe(testTransaction.input);
      expect(transaction.maxFeePerGas).toBe(testTransaction.maxFeePerGas);
      expect(transaction.maxPriotityFeePerGas).toBe(testTransaction.maxPriotityFeePerGas);
      expect(transaction.gasPrice).toBe(testTransaction.gasPrice);
    });

    it("returns 400 for invalid transaction hash", async () => {
      return request(server)
        .get(`/transactions/invalidHash`)
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
