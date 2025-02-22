import { ITimeProvider } from "@backend/Providers/TimeProvider/Contracts/ITimeProvider";
import { LuxonTimeProvider } from "@backend/Providers/TimeProvider/Providers/LuxonTimeProvider";
import { Module } from "@nestjs/common";

@Module({
	imports: [],
	providers: [
		{
			provide: ITimeProvider,
			useClass: LuxonTimeProvider,
		},
	],
	exports: [ITimeProvider],
})
export class TimeProviderModule {}
