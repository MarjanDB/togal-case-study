import { StoredDocument, StoredDocumentHash, StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentProvider } from "@backend/Modules/StoredDocument/Providers/StoredDocumentProvider";
import { StoredDocumentModule } from "@backend/Modules/StoredDocument/StoredDocument.module";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { ProvidersModule } from "@backend/Providers/Providers.module";
import { TestValues } from "@backend/Utils/PredefinedValues";
import { Test, TestingModule } from "@nestjs/testing";
import { DateTime } from "luxon";

describe("StoredDocumentProvider", () => {
	let provider: StoredDocumentProvider;
	let database: IPostgresDatabaseProvider;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ProvidersModule, StoredDocumentModule],
		}).compile();

		module.enableShutdownHooks();

		await module.init();

		provider = module.get<StoredDocumentProvider>(StoredDocumentProvider);

		database = module.get<IPostgresDatabaseProvider>(IPostgresDatabaseProvider);

		await database.query("TRUNCATE TABLE stored_documents CASCADE", {}, (value) => value);
	});

	afterEach(async () => {
		await database.query("TRUNCATE TABLE stored_documents CASCADE", {}, (value) => value);

		await module.close();
	});

	it("should create a stored document", async () => {
		const document = new StoredDocument(
			TestValues.Identifiers.INVALID_UUID as StoredDocumentId,
			"hash" as StoredDocumentHash,
			DateTime.now().toUTC(),
			"test.txt",
			new Uint8Array(Buffer.from("test")),
		);

		await provider.create(document);

		const result = await provider.findById(document.id);

		expect(result.id).toEqual(document.id);
		expect(result.hash).toEqual(document.hash);
		expect(result.storedAt).toEqual(document.storedAt);
		expect(result.originalFileName).toEqual(document.originalFileName);
		expect(result.data.buffer).toEqual(document.data.buffer);
	});
});
