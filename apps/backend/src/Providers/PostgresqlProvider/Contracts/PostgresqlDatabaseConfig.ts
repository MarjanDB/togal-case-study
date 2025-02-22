import typia from "typia";

export interface PostgresqlDatabaseConfig {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
}

export const PostgresqlDatabaseConfig = {
	asserter: typia.createAssert<PostgresqlDatabaseConfig>(),
};
