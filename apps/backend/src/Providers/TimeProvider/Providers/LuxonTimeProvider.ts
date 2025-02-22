import { ITimeProvider } from "@backend/Providers/TimeProvider/Contracts/ITimeProvider";
import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";

@Injectable()
export class LuxonTimeProvider implements ITimeProvider {
	public getTime(): DateTime {
		return DateTime.now();
	}
}
