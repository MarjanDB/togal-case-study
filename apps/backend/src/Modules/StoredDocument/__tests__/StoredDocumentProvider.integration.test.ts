import { IStoredDocumentProvider } from "@backend/Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument, StoredDocumentHash, StoredDocumentId } from "@backend/Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentModule } from "@backend/Modules/StoredDocument/StoredDocument.module";
import { IVirtualDocumentProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { IVirtualDocumentStoredDocumentsProvider } from "@backend/Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocument, VirtualDocumentId, VirtualDocumentType } from "@backend/Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentModule } from "@backend/Modules/VirtualDocument/VirtualDocument.module";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { ProvidersModule } from "@backend/Providers/Providers.module";
import { IUniqueIdentifierProvider } from "@backend/Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { TestValues } from "@backend/Utils/PredefinedValues";
import { Test, TestingModule } from "@nestjs/testing";
import { DateTime } from "luxon";

describe("StoredDocumentProvider", () => {
	let provider: IStoredDocumentProvider;
	let virtualDocumentProvider: IVirtualDocumentProvider;
	let virtualDocumentStoredDocumentsProvider: IVirtualDocumentStoredDocumentsProvider;
	let database: IPostgresDatabaseProvider;
	let identifierProvider: IUniqueIdentifierProvider;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ProvidersModule, StoredDocumentModule, VirtualDocumentModule],
		}).compile();

		module.enableShutdownHooks();

		await module.init();

		provider = module.get<IStoredDocumentProvider>(IStoredDocumentProvider);
		virtualDocumentProvider = module.get<IVirtualDocumentProvider>(IVirtualDocumentProvider);
		virtualDocumentStoredDocumentsProvider = module.get<IVirtualDocumentStoredDocumentsProvider>(IVirtualDocumentStoredDocumentsProvider);
		database = module.get<IPostgresDatabaseProvider>(IPostgresDatabaseProvider);
		identifierProvider = module.get<IUniqueIdentifierProvider>(IUniqueIdentifierProvider);
		await database.query("TRUNCATE TABLE virtual_documents CASCADE", {}, (value) => value);
		await database.query("TRUNCATE TABLE stored_documents CASCADE", {}, (value) => value);
	});

	afterEach(async () => {
		await database.query("TRUNCATE TABLE virtual_documents CASCADE", {}, (value) => value);
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

	it("should find only the most recent stored document", async () => {
		const virtualDocument = new VirtualDocument(
			TestValues.Identifiers.INVALID_UUID as VirtualDocumentId,
			"test1",
			"test1",
			DateTime.now().toUTC(),
			DateTime.now().toUTC(),
			null,
			VirtualDocumentType.PDF,
		);

		await virtualDocumentProvider.create(virtualDocument);

		const storedDocument1 = new StoredDocument(
			identifierProvider.getUniqueIdentifier<StoredDocumentId>(),
			"hash1" as StoredDocumentHash,
			DateTime.now().toUTC(),
			"test1.pdf",
			new Uint8Array(Buffer.from("test1")),
		);
		const storedDocument2 = new StoredDocument(
			identifierProvider.getUniqueIdentifier<StoredDocumentId>(),
			"hash2" as StoredDocumentHash,
			DateTime.now().plus({ seconds: 20 }).toUTC(),
			"test2.pdf",
			new Uint8Array(Buffer.from("test2")),
		);

		await provider.create(storedDocument1);
		await provider.create(storedDocument2);
		await virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocument.id, storedDocument1.id);
		await virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocument.id, storedDocument2.id);

		const result = await provider.findMostRecentForVirtualDocuments([virtualDocument.id]);

		expect(result.length).toEqual(1);
		expect(result[0].id).toEqual(storedDocument2.id);
	});
});
