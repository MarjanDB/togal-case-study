import { IPostgresqlDatabaseFactory } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseFactory";
import { PostgresqlDatabaseFactory } from "@backend/Providers/PostgresqlProvider/Factories/PostgresqlDatabaseFactory";
import { Module } from "@nestjs/common";

@Module({
	imports: [],
	providers: [
		{
			provide: IPostgresqlDatabaseFactory,
			useClass: PostgresqlDatabaseFactory,
		},
	],
	exports: [IPostgresqlDatabaseFactory],
})
export class PostgresqlProviderModule {}
