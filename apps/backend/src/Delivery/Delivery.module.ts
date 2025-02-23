import { ModulesModule } from "@backend/Modules/Modules.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [ModulesModule],
	providers: [],
	exports: [],
})
export class DeliveryModule {}
