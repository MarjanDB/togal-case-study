import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PostgresqlProviderModule } from "Providers/PostgresqlProvider/PostgresqlProvider.module";
import { TimeProviderModule } from "Providers/TimeProvider/TimeProvider.module";
import { UniqueIdentifierProviderModule } from "Providers/UniqueIdentifierProvider/UniqueIdentifierProvider.module";

@Global()
@Module({
	imports: [PostgresqlProviderModule, ConfigModule.forRoot(), TimeProviderModule, UniqueIdentifierProviderModule],
	providers: [Logger],
	exports: [PostgresqlProviderModule, ConfigModule, Logger, TimeProviderModule, UniqueIdentifierProviderModule],
})
export class ProvidersModule {}
