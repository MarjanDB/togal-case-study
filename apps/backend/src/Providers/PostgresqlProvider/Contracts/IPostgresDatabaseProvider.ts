import { Column, IColumnConfig } from "pg-promise";

export abstract class IPostgresDatabaseProvider {
	abstract query<ResponseType>(
		sql: string,
		params: Record<string, unknown>,
		validator: (value: unknown) => ResponseType,
	): Promise<ResponseType>;

	// ColumnSet internals are leaking here because of the way the pg-promise works
	abstract insert<ResponseType = void>(
		data: ResponseType[],
		columns: Array<string | IColumnConfig<ResponseType> | Column<ResponseType>>,
		table: string,
	): Promise<ResponseType>;

	// ColumnSet internals are leaking here because of the way the pg-promise works
	abstract update<ResponseType = void>(
		data: ResponseType[],
		conditionColumns: Array<string | IColumnConfig<ResponseType> | Column<ResponseType>>,
		toUpdateColumns: Array<string | IColumnConfig<ResponseType> | Column<ResponseType>>,
		table: string,
	): Promise<ResponseType>;

	abstract shutdown(): Promise<void>;
}
