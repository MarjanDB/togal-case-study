import { Injectable } from "@nestjs/common";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { PostgresqlDatabaseConfig } from "Providers/PostgresqlProvider/Contracts/PostgresqlDatabaseConfig";

@Injectable()
export abstract class IPostgresqlDatabaseFactory {
	public abstract getDatabaseProvider(config: PostgresqlDatabaseConfig): IPostgresDatabaseProvider;
}
