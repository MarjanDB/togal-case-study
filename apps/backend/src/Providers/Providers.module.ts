import { PostgresqlProviderModule } from "@backend/Providers/PostgresqlProvider/PostgresqlProvider.module";
import { TimeProviderModule } from "@backend/Providers/TimeProvider/TimeProvider.module";
import { UniqueIdentifierProviderModule } from "@backend/Providers/UniqueIdentifierProvider/UniqueIdentifierProvider.module";
import { Global, Logger, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
	imports: [PostgresqlProviderModule, ConfigModule.forRoot(), TimeProviderModule, UniqueIdentifierProviderModule],
	providers: [Logger],
	exports: [PostgresqlProviderModule, ConfigModule, Logger, TimeProviderModule, UniqueIdentifierProviderModule],
})
export class ProvidersModule {}
