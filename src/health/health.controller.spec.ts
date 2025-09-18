import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Server } from "http";
import request from "supertest";
import { HealthModule } from "./health.module";

describe("HealthController", () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
    app = module.createNestApplication();
    server = app.getHttpServer();

    await app.init();
  });

  it("should return 200 OK", () => {
    return request(server).get("/healthz").expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
