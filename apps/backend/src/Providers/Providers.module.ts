import { PostgresqlProviderModule } from "@backend/Providers/PostgresqlProvider/PostgresqlProvider.module";
import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
	imports: [PostgresqlProviderModule, ConfigModule.forRoot()],
	providers: [Logger],
	exports: [PostgresqlProviderModule, ConfigModule, Logger],
})
export class ProvidersModule {}
