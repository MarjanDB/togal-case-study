import { Test, TestingModule } from "@nestjs/testing";
import { DateTime } from "luxon";
import { IStoredDocumentProvider } from "Modules/StoredDocument/Contracts/IStoredDocumentProvider";
import { StoredDocument } from "Modules/StoredDocument/Entities/StoredDocument";
import { StoredDocumentModule } from "Modules/StoredDocument/StoredDocument.module";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { IVirtualDocumentStoredDocumentsProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentStoredDocumentsProvider";
import { VirtualDocument } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentModule } from "Modules/VirtualDocument/VirtualDocument.module";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { ProvidersModule } from "Providers/Providers.module";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { TestValues } from "Utils/PredefinedValues";

describe("StoredDocumentProvider", () => {
	let provider: IStoredDocumentProvider.Interface;
	let virtualDocumentProvider: IVirtualDocumentProvider.Interface;
	let virtualDocumentStoredDocumentsProvider: IVirtualDocumentStoredDocumentsProvider.Interface;
	let database: IPostgresDatabaseProvider;
	let identifierProvider: IUniqueIdentifierProvider;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ProvidersModule, StoredDocumentModule, VirtualDocumentModule],
		}).compile();

		module.enableShutdownHooks();

		await module.init();

		provider = module.get<IStoredDocumentProvider.Interface>(IStoredDocumentProvider.Interface);
		virtualDocumentProvider = module.get<IVirtualDocumentProvider.Interface>(IVirtualDocumentProvider.Interface);
		virtualDocumentStoredDocumentsProvider = module.get<IVirtualDocumentStoredDocumentsProvider.Interface>(
			IVirtualDocumentStoredDocumentsProvider.Interface,
		);
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
		const document = new StoredDocument.Entity(
			TestValues.Identifiers.INVALID_UUID as StoredDocument.Types.IdType,
			"hash" as StoredDocument.Types.HashType,
			DateTime.now().toUTC(),
			"test.txt",
			Buffer.from("test"),
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
		const virtualDocument = new VirtualDocument.Entity(
			TestValues.Identifiers.INVALID_UUID as VirtualDocument.Types.IdType,
			"test1",
			"test1",
			DateTime.now().toUTC(),
			DateTime.now().toUTC(),
			null,
			VirtualDocument.Types.DocumentType.PDF,
		);

		await virtualDocumentProvider.create(virtualDocument);

		const storedDocument1 = new StoredDocument.Entity(
			identifierProvider.getUniqueIdentifier<StoredDocument.Types.IdType>(),
			"hash1" as StoredDocument.Types.HashType,
			DateTime.now().toUTC(),
			"test1.pdf",
			Buffer.from("test1"),
		);
		const storedDocument2 = new StoredDocument.Entity(
			identifierProvider.getUniqueIdentifier<StoredDocument.Types.IdType>(),
			"hash2" as StoredDocument.Types.HashType,
			DateTime.now().plus({ seconds: 20 }).toUTC(),
			"test2.pdf",
			Buffer.from("test2"),
		);

		await provider.create(storedDocument1);
		await provider.create(storedDocument2);
		await virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocument.id, storedDocument1.id);
		await virtualDocumentStoredDocumentsProvider.addStoredDocumentToVirtualDocument(virtualDocument.id, storedDocument2.id);

		const result = await provider.findMostRecentStoredDocumentEntriesForVirtualDocuments([virtualDocument.id]);

		expect(result.length).toEqual(1);
		expect(result[0].id).toEqual(storedDocument2.id);
	});
});
