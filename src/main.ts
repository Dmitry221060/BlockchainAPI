import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import config from "./config";
import { AppModule } from "./app.module";
import logger from "./utils/logger";

const { port } = config.server;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(helmet());

  if (process.env.NODE_ENV == "dev") {
    const options = new DocumentBuilder()
      .setTitle("BlockchainAPI")
      .setDescription(
        "https://github.com/Dmitry221060/BlockchainAPI",
      )
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api-docs", app, documentFactory);
  }

  await app.listen(port);
  logger.info(`Server running at port ${port}`);
}
void bootstrap();
