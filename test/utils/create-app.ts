import { ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { NestExpressApplication } from "@nestjs/platform-express";
import "tsconfig-paths/register";
import { AppModule } from "src/app.module";

export async function createApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forFeature(() => ({
        COSMOS_RPC_NODE: "https://cosmos-rpc.publicnode.com:443",
      })),
      AppModule,
    ],
  }).compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>();
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  await app.listen(config.getOrThrow<number>("APP_PORT"));

  return app;
}
