import { DateTime } from "luxon";

export type IdentifierOptions = {
	when?: DateTime;
};

export abstract class IUniqueIdentifierProvider {
	public abstract getUniqueIdentifier<T extends string>(options?: IdentifierOptions): T;
}
