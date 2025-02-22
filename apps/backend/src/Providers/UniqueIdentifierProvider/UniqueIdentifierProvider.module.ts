import { TimeProviderModule } from "@backend/Providers/TimeProvider/TimeProvider.module";
import { IUniqueIdentifierProvider } from "@backend/Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { UUID7Provider } from "@backend/Providers/UniqueIdentifierProvider/Providers/UUID7Provider";
import { Module } from "@nestjs/common";

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
