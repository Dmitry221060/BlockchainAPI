import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { AppModule } from "./app.module";
import logger from "./utils/logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(helmet());

  if (config.getOrThrow<string>("NODE_ENV") == "dev") {
    const options = new DocumentBuilder()
      .setTitle("BlockchainAPI")
      .setDescription("https://github.com/Dmitry221060/BlockchainAPI")
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api-docs", app, documentFactory);
  }

  const port = config.getOrThrow<number>("APP_PORT");
  await app.listen(port);
  logger.info(`Server running at port ${port}`);
}
void bootstrap();
