import { ProvidersModule } from "@backend/Providers/Providers.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [ProvidersModule],
})
export class AppModule {}
