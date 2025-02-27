import { Inject, Injectable } from "@nestjs/common";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";
import { IdentifierOptions, IUniqueIdentifierProvider } from "Providers/UniqueIdentifierProvider/Contracts/IUniqueIdentifierProvider";
import { v7 as uuidv7 } from "uuid";

@Injectable()
export class UUID7Provider implements IUniqueIdentifierProvider {
	public constructor(@Inject(ITimeProvider) private readonly timeProvider: ITimeProvider) {}

	// TODO: Reminder to fix Generic once uuid fixes their types
	public getUniqueIdentifier<T extends string = string>(options?: IdentifierOptions): T {
		const when = options?.when ?? this.timeProvider.getTime();

		return uuidv7({
			msecs: when.toMillis(),
		}) as unknown as T;
	}
}
