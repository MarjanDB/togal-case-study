import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IPostgresqlDatabaseFactory } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseFactory";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { PostgresqlDatabaseConfig } from "Providers/PostgresqlProvider/Contracts/PostgresqlDatabaseConfig";
import { PostgresqlDatabaseFactory } from "Providers/PostgresqlProvider/Factories/PostgresqlDatabaseFactory";

@Module({
	imports: [],
	providers: [
		{
			provide: IPostgresqlDatabaseFactory,
			useClass: PostgresqlDatabaseFactory,
		},
		{
			provide: IPostgresDatabaseProvider,
			useFactory: (configService: ConfigService, factory: IPostgresqlDatabaseFactory): IPostgresDatabaseProvider => {
				const databaseHost = configService.getOrThrow("DATABASE_HOST");
				const databasePort = configService.getOrThrow("DATABASE_PORT");
				const databaseUser = configService.getOrThrow("DATABASE_USER");
				const databasePassword = configService.getOrThrow("DATABASE_PASSWORD");
				const databaseName = configService.getOrThrow("DATABASE_NAME");

				const config: PostgresqlDatabaseConfig = {
					host: databaseHost,
					port: databasePort,
					user: databaseUser,
					password: databasePassword,
					database: databaseName,
				};

				return factory.getDatabaseProvider(config);
			},
			inject: [ConfigService, IPostgresqlDatabaseFactory],
		},
	],
	exports: [IPostgresqlDatabaseFactory, IPostgresDatabaseProvider],
})
export class PostgresqlProviderModule {}
