import { DeliveryModule } from "@backend/Delivery/Delivery.module";
import { ModulesModule } from "@backend/Modules/Modules.module";
import { ProvidersModule } from "@backend/Providers/Providers.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [
		ProvidersModule, // Modules that interact with external data (DB, Config, etc)
		ModulesModule, // Business logic modules (not actually required, since they're imported by DeliveryModule as well)
		DeliveryModule, // Endpoints
	],
})
export class AppModule {}
