import { Module } from "@nestjs/common";
import { TimeProviderModule } from "Providers/TimeProvider/TimeProvider.module";
import { IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { UUID7Provider } from "Providers/UniqueIdentifierProvider/Providers/UUID7Provider";

@Module({
	imports: [TimeProviderModule],
	providers: [
		UUID7Provider,
		{
			provide: IUniqueIdentifierProvider,
			useClass: UUID7Provider,
		},
	],
	exports: [IUniqueIdentifierProvider],
})
export class UniqueIdentifierProviderModule {}
