import { AppModule } from "@backend/App.module";
import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function prepare(): Promise<INestApplication> {
	const app = await NestFactory.create<INestApplication>(AppModule);
	const globalPrefix = "api";
	app.setGlobalPrefix(globalPrefix);

	const documentationConfig = new DocumentBuilder()
		.setTitle("API Documentation")
		.setDescription("Documentation for all endpoints")
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, documentationConfig);
	SwaggerModule.setup("/docs", app, document);

	app.useGlobalPipes(
		new ValidationPipe({
			enableDebugMessages: true,
			disableErrorMessages: false,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			whitelist: true,
			transform: true,
		}),
	);

	return app;
}

async function bootstrap(): Promise<void> {
	const app = await prepare();
	const port = process.env.PORT || 3000;
	await app.listen(port);
	Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

if (import.meta.env.PROD) {
	bootstrap();
}

export const viteNodeApp = prepare();
