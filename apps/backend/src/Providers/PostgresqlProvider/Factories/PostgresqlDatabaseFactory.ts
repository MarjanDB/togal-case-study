import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { PostgresqlDatabaseConfig } from "@backend/Providers/PostgresqlProvider/Contracts/PostgresqlDatabaseConfig";
import { PostgresqlDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Providers/PostgresqlDatabaseProvider";
import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import crypto from "crypto";
import { DateTime } from "luxon";
import pgp from "pg-promise";

@Injectable()
export class PostgresqlDatabaseFactory implements OnModuleDestroy {
	private readonly providers: Map<string, PostgresqlDatabaseProvider> = new Map<string, PostgresqlDatabaseProvider>();
	private pgpConnectionFactory!: ReturnType<typeof pgp>;

	constructor(@Inject(Logger) private readonly logger: Logger) {
		this.pgpConnectionFactory = pgp();

		this.pgpConnectionFactory.pg.types.setTypeParser(this.pgpConnectionFactory.pg.types.builtins.INT8, (value: string) =>
			parseInt(value, 10),
		);

		this.pgpConnectionFactory.pg.types.setTypeParser(this.pgpConnectionFactory.pg.types.builtins.FLOAT4, (value: string) =>
			parseFloat(value),
		);

		this.pgpConnectionFactory.pg.types.setTypeParser(this.pgpConnectionFactory.pg.types.builtins.FLOAT8, (value: string) =>
			parseFloat(value),
		);

		this.pgpConnectionFactory.pg.types.setTypeParser(this.pgpConnectionFactory.pg.types.builtins.TIMESTAMPTZ, (value: string) =>
			DateTime.fromSQL(value, { setZone: true }),
		);
	}

	public async onModuleDestroy(): Promise<void> {
		const databaseInstances = Array.from(this.providers.values());
		const databaseShutdownPromises = databaseInstances.map((db) => db.shutdown());
		await Promise.allSettled(databaseShutdownPromises);
	}

	public getDatabaseProvider(config: PostgresqlDatabaseConfig): IPostgresDatabaseProvider {
		const configHash = crypto.createHash("md5").update(JSON.stringify(config)).digest("hex");
		let provider = this.providers.get(configHash);

		if (provider !== undefined) {
			return provider;
		}

		const pool = this.pgpConnectionFactory(config);
		provider = new PostgresqlDatabaseProvider(pool, this.logger);

		this.providers.set(configHash, provider);

		return provider;
	}
}
