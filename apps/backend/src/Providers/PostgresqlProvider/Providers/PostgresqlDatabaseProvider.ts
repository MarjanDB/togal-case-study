import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { Logger } from "@nestjs/common";
import pgPromise, { Column, IColumnConfig } from "pg-promise";

export class PostgresqlDatabaseProvider implements IPostgresDatabaseProvider {
	constructor(
		private readonly pool: ReturnType<ReturnType<typeof pgPromise>>,
		private readonly logger: Logger,
	) {}

	public async query<ResponseType>(
		sql: string,
		params: Record<string, unknown> = {},
		validator: (value: unknown) => ResponseType = (value) => value as ResponseType,
	): Promise<ResponseType> {
		this.logger.debug("Querying: ", sql, params);

		const response = await this.pool.manyOrNone<ResponseType>(sql, params);

		// Not really required, I just personally like to have type safety everywhere I can
		// Cons:
		// - Performance hit (haven't measured how much)
		// Pros:
		// - Type safety
		// Alternative:
		// - If the performance hit is too much, it can be made toggleable with a DEBUG flag or something
		return validator(response);
	}

	public async insert<ResponseType>(
		data: ResponseType[],
		columns: Array<string | IColumnConfig<ResponseType> | Column<ResponseType>>,
		table: string,
	): Promise<ResponseType> {
		const columnSet = new this.pool.$config.pgp.helpers.ColumnSet(columns, {
			table: table,
		});

		const sql = this.pool.$config.pgp.helpers.insert(data, columnSet);

		return this.query(sql);
	}

	public async shutdown(): Promise<void> {
		return this.pool.$pool.end();
	}
}
