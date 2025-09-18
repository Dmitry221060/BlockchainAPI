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
    const testBlock = {
      height: 27585824,
      time: "2025-09-18T19:52:20.512176452Z",
      hash: "3E752C0F626DA5E162689608C560EBB5E0D129296331364245D16B77362938E0",
      proposedAddress: "8E0EE37B7B1A038DD145E30F1EF97DF3619EF429",
    };

    it("returns block info for valid block number", async () => {
      const response = await request(server)
        .get(`/cosmos/block/${testBlock.height}`)
        .expect(200);

      const block = response.body;
      expect(block).not.toBeNull();
      expect(block.height).toBe(testBlock.height);
      expect(block.time).toBe(testBlock.time);
      expect(block.hash).toBe(testBlock.hash);
      expect(block.proposedAddress).toBe(testBlock.proposedAddress);
    });

    it("returns 400 for invalid block number", async () => {
      return request(server).get(`/cosmos/block/-9999999`).expect(400);
    });
  });

  describe("/transactions", () => {
    const testTransaction = {
      hash: "803C58944980283697E8EC64E3F1E60674013CB0B80CF2D3DCCB9D2A337F11A1",
      height: 27585824,
      time: "2025-09-18T19:52:20Z",
      gasUsed: "93949",
      gasWanted: "141976",
      fee: "120963552 uatom",
      sender:
        "0A21038D4D5646190A2E3B76C22D82F22464CB3A17916B3CB57AABFE48F3D90C651350",
    };

    it("returns transaction info for valid hash", async () => {
      const response = await request(server)
        .get(`/cosmos/transactions/${testTransaction.hash}`)
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
        .get(`/cosmos/transactions/invalidHash`)
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
