import { INestApplication } from "@nestjs/common";
import { Server } from "http";
import request from "supertest";
import { createApp } from "../utils/create-app";

describe("Cosmos", () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    app = await createApp();
    server = app.getHttpServer();
  });

  describe("/block", () => {
    let testBlock = {
      height: 1,
      time: 1758200817512,
      hash: "hash",
      proposedAddress: "address"
    };

    it("returns block info for valid block number", async () => {
      const response = await request(server)
        .get(`/block/${testBlock.height}`)
        .expect(200);

      const block = response.body;
      expect(block).not.toBeNull();
      expect(block.height).toBe(testBlock.height);
      expect(block.time).toBe(testBlock.time);
      expect(block.hash).toBe(testBlock.hash);
      expect(block.proposedAddress).toBe(testBlock.proposedAddress);
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
      height: 1,
      time: 1758200817512,
      gasUsed: 0,
      gasWanted: 0,
      fee: 0,
      sender: "sender"
    };

    it("returns transaction info for valid hash", async () => {
      const response = await request(server)
        .get(`/transactions/${testTransaction.hash}`)
        .expect(200);

      const transaction = response.body;
      expect(transaction).not.toBeNull();
      expect(transaction.hash).toBe(testTransaction.hash);
      expect(transaction.height).toBe(testTransaction.height);
      expect(transaction.time).toBe(testTransaction.time);
      expect(transaction.gasUsed).toBe(testTransaction.gasUsed);
      expect(transaction.gasWanted).toBe(testTransaction.gasWanted);
      expect(transaction.fee).toBe(testTransaction.fee);
      expect(transaction.sender).toBe(testTransaction.sender);
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
