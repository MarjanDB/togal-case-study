import { Test, TestingModule } from "@nestjs/testing";
import { DateTime } from "luxon";
import { IVirtualFolderProvider } from "Modules/VirtualFolder/Contracts/IVirtualFolderProvider";
import { VirtualFolder } from "Modules/VirtualFolder/Entities/VirtualFolder";
import { VirtualFolderModule } from "Modules/VirtualFolder/VirtualFolder.module";
import { IPostgresDatabaseProvider } from "Providers/PostgresqlProvider/Contracts/IPostgresDatabaseProvider";
import { ProvidersModule } from "Providers/Providers.module";
import { TestValues } from "Utils/PredefinedValues";

describe("VirtualFolderProvider", () => {
	let provider: IVirtualFolderProvider.Interface;
	let database: IPostgresDatabaseProvider;
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ProvidersModule, VirtualFolderModule],
		}).compile();

		module.enableShutdownHooks();

		await module.init();

		provider = module.get<IVirtualFolderProvider.Interface>(IVirtualFolderProvider.Interface);

		database = module.get<IPostgresDatabaseProvider>(IPostgresDatabaseProvider);

		await database.query("TRUNCATE TABLE virtual_folders CASCADE", {}, (value) => value);
	});

	afterEach(async () => {
		await database.query("TRUNCATE TABLE virtual_folders CASCADE", {}, (value) => value);

		await module.close();
	});

	it("should create a virtual folder", async () => {
		const folder = new VirtualFolder.Entity(
			TestValues.Identifiers.INVALID_UUID as VirtualFolder.Types.IdType,
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
