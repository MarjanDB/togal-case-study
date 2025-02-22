import { ModulesModule } from "@backend/Modules/Modules.module";
import { ProvidersModule } from "@backend/Providers/Providers.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [
		ProvidersModule, // Modules that interact with external data (DB, Config, etc)
		ModulesModule, // Business logic modules
	],
})
export class AppModule {}
