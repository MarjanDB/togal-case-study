import { IVirtualFolderProvider } from "@backend/Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder, VirtualFolderId } from "@backend/Modules/VirtualFolder/Entities/VirtualFolder";
import { VirtualFolderModule } from "@backend/Modules/VirtualFolder/VirtualFolder.module";
import { IPostgresDatabaseProvider } from "@backend/Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { ProvidersModule } from "@backend/Providers/Providers.module";
import { TestValues } from "@backend/Utils/PredefinedValues";
import { Test, TestingModule } from "@nestjs/testing";
import { DateTime } from "luxon";

describe("VirtualFolderProvider", () => {
	let provider: IVirtualFolderProvider;
	let database: IPostgresDatabaseProvider;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ProvidersModule, VirtualFolderModule],
		}).compile();

		module.enableShutdownHooks();

		await module.init();

		provider = module.get<IVirtualFolderProvider>(IVirtualFolderProvider);

		database = module.get<IPostgresDatabaseProvider>(IPostgresDatabaseProvider);

		await database.query("TRUNCATE TABLE virtual_folders CASCADE", {}, (value) => value);
	});

	afterEach(async () => {
		await database.query("TRUNCATE TABLE virtual_folders CASCADE", {}, (value) => value);

		await module.close();
	});

	it("should create a virtual folder", async () => {
		const folder = new VirtualFolder(
			TestValues.Identifiers.INVALID_UUID as VirtualFolderId,
			"test",
			DateTime.now().toUTC(),
			DateTime.now().toUTC(),
			null,
		);

		await provider.create(folder);

		const result = await provider.findById(folder.id);

		expect(result.id).toEqual(folder.id);
		expect(result.name).toEqual(folder.name);
		expect(result.createdAt).toEqual(folder.createdAt);
		expect(result.updatedAt).toEqual(folder.updatedAt);
		expect(result.deletedAt).toEqual(folder.deletedAt);
	});
});
