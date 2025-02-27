import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";

@Injectable()
export class LuxonTimeProvider implements ITimeProvider {
	public getTime(): DateTime {
		return DateTime.now();
	}
}
