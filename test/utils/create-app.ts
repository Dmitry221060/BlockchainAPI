import { ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Test, TestingModuleBuilder } from "@nestjs/testing";
import { NestExpressApplication } from "@nestjs/platform-express";
import "tsconfig-paths/register";
import { AppModule } from "src/app.module";

export interface CreateAppOptions {
  moduleBuilderHook?: (
    moduleBuilder: TestingModuleBuilder,
  ) => TestingModuleBuilder;
}

export async function createApp(options: CreateAppOptions = {}) {
  let moduleRef = Test.createTestingModule({
    imports: [
      ConfigModule.forFeature(() => ({
        EVM_RPC_NODE: "https://sei-evm-rpc.publicnode.com",
        COSMOS_RPC_NODE: "https://cosmos-rpc.publicnode.com:443",
      })),
      AppModule,
    ],
  });

  if (options.moduleBuilderHook) {
    moduleRef = options.moduleBuilderHook(moduleRef);
  }

  const moduleFixture = await moduleRef.compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.init();

  await app.listen(config.get<number>("APP_PORT") ?? 8080);

  return app;
}
