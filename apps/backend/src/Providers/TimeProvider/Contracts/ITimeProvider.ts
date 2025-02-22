import { DateTime } from "luxon";

export abstract class ITimeProvider {
	public abstract getTime(): DateTime;
}
