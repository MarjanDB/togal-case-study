import { Module } from "@nestjs/common";
import { DeliveryModule } from "Delivery/Delivery.module";
import { ModulesModule } from "Modules/Modules.module";
import { ProvidersModule } from "Providers/Providers.module";

@Module({
	imports: [
		ProvidersModule, // Modules that interact with external data (DB, Config, etc)
		ModulesModule, // Business logic modules (not actually required, since they're imported by DeliveryModule as well)
		DeliveryModule, // Endpoints
	],
})
export class AppModule {}
