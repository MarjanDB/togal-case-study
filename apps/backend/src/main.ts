import { AppModule } from "@backend/App.module";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

async function prepare(): Promise<NestExpressApplication> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const globalPrefix = "api";
	app.setGlobalPrefix(globalPrefix);
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
