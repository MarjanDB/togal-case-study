import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { PostgresqlDatabaseConfig } from "@backend/Providers/PostgresqlProvider/Contracts/PostgresqlDatabaseConfig";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IPostgresqlDatabaseFactory {
	public abstract getDatabaseProvider(config: PostgresqlDatabaseConfig): IPostgresDatabaseProvider;
}
