import { PostgresqlProviderModule } from "@backend/Providers/PostgresqlProvider/PostgresqlProvider.module";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	imports: [PostgresqlProviderModule],
	providers: [],
	exports: [PostgresqlProviderModule],
})
export class ProvidersModule {}
