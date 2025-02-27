import { Test, TestingModule } from "@nestjs/testing";
import { DateTime } from "luxon";
import { IVirtualDocumentProvider } from "Modules/VirtualDocument/Contracts/IVirtualDocumentProvider";
import { VirtualDocument, VirtualDocumentId, VirtualDocumentType } from "Modules/VirtualDocument/Entities/VirtualDocument";
import { VirtualDocumentModule } from "Modules/VirtualDocument/VirtualDocument.module";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { ProvidersModule } from "Providers/Providers.module";
import { TestValues } from "Utils/PredefinedValues";

describe("VirtualDocumentProvider", () => {
	let provider: IVirtualDocumentProvider;
	let database: IPostgresDatabaseProvider;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ProvidersModule, VirtualDocumentModule],
		}).compile();

		module.enableShutdownHooks();

		await module.init();

		provider = module.get<IVirtualDocumentProvider>(IVirtualDocumentProvider);

		database = module.get<IPostgresDatabaseProvider>(IPostgresDatabaseProvider);

		await database.query("TRUNCATE TABLE virtual_documents CASCADE", {}, (value) => value);
	});

	afterEach(async () => {
		await database.query("TRUNCATE TABLE virtual_documents CASCADE", {}, (value) => value);

		await module.close();
	});

	it("should create a virtual document", async () => {
		const document = new VirtualDocument(
			TestValues.Identifiers.INVALID_UUID as VirtualDocumentId,
			"test",
			"test",
			DateTime.now().toUTC(),
			DateTime.now().toUTC(),
			null,
			VirtualDocumentType.PDF,
		);

		await provider.create(document);

		const result = await provider.findById(document.id);

		expect(result.id).toEqual(document.id);
		expect(result.name).toEqual(document.name);
		expect(result.description).toEqual(document.description);
		expect(result.createdAt).toEqual(document.createdAt);
		expect(result.updatedAt).toEqual(document.updatedAt);
		expect(result.deletedAt).toEqual(document.deletedAt);
		expect(result.type).toEqual(document.type);
	});
});
