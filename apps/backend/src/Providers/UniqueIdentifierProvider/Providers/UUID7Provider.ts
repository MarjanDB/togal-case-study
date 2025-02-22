import { LuxonTimeProvider } from "@backend/Providers/TimeProvider/Providers/LuxonTimeProvider";
import { IdentifierOptions, IUniqueIdentifierProvider } from "@backend/Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { Injectable } from "@nestjs/common";
import { v7 as uuidv7 } from "uuid";

@Injectable()
export class UUID7Provider implements IUniqueIdentifierProvider {
	public constructor(private readonly timeProvider: LuxonTimeProvider) {}

	// TODO: Reminder to fix Generic once uuid fixes their types
	public getUniqueIdentifier<T extends string = string>(options?: IdentifierOptions): T {
		const when = options?.when ?? this.timeProvider.getTime();

		return uuidv7({
			msecs: when.toMillis(),
		}) as unknown as T;
	}
}
