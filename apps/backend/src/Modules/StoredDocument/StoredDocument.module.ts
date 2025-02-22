import { StoredDocumentProvider } from "@backend/Modules/StoredDocument/Providers/StoredDocumentProvider";
import { IPostgresqlDatabaseFactory } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseFactory";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { PostgresqlDatabaseConfig } from "@backend/Providers/PostgresqlProvider/Contracts/PostgresqlDatabaseConfig";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
@Module({
	imports: [],
	providers: [
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
		StoredDocumentProvider,
	],
	exports: [],
})
export class StoredDocumentModule {}
