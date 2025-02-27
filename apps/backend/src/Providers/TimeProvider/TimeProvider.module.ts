import { Module } from "@nestjs/common";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { LuxonTimeProvider } from "Providers/TimeProvider/Providers/LuxonTimeProvider";

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
