import { Logger } from "@nestjs/common";
import pgPromise, { Column, IColumnConfig } from "pg-promise";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";

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

	public async update<ResponseType>(
		data: ResponseType[],
		conditionColumns: Array<string | IColumnConfig<ResponseType> | Column<ResponseType>>,
		toUpdateColumns: Array<string | IColumnConfig<ResponseType> | Column<ResponseType>>,
		table: string,
	): Promise<ResponseType> {
		const allSets = new this.pool.$config.pgp.helpers.ColumnSet([...conditionColumns, ...toUpdateColumns], {
			table: table,
		});

		const rawNames = conditionColumns.filter(isColumnString);
		const columnConfigs = conditionColumns.filter(isColumnConfig);
		const columns = conditionColumns.filter(isColumn);

		// Naive implementation, but should work for this case
		const rawConditions = rawNames.map((name) => `t.${name.substring(1)} = v.${name.substring(1)}`);
		const columnConfigConditions = columnConfigs.map((columnConfig) => `t.${columnConfig.name} = v.${columnConfig.name}`);
		const columnConditions = columns.map((column) => `t.${column.escapedName} = v.${column.escapedName}`);

		const conditions = [...rawConditions, ...columnConfigConditions, ...columnConditions];

		const sql = this.pool.$config.pgp.helpers.update(data, allSets) + "WHERE " + conditions.join(" AND ");

		return this.query(sql);
	}

	public async shutdown(): Promise<void> {
		return this.pool.$pool.end();
	}
}

function isColumnString(column: string | IColumnConfig<unknown> | Column<unknown>): column is string {
	return typeof column === "string";
}

function isColumnConfig<ResponseType>(
	column: string | IColumnConfig<ResponseType> | Column<ResponseType>,
): column is IColumnConfig<ResponseType> {
	return typeof column === "object" && "name" in column && !("prop" in column);
}

function isColumn<ResponseType>(column: string | IColumnConfig<ResponseType> | Column<ResponseType>): column is Column<ResponseType> {
	return typeof column === "object" && column !== null && "name" in column && "type" in column && "cast" in column;
}
