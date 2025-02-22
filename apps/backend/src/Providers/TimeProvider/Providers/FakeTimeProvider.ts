import { ITimeProvider } from "@backend/Providers/TimeProvider/Contracts/ITimeProvider";
import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";

@Injectable()
export class FakeTimeProvider implements ITimeProvider {
	public constructor(private readonly time: DateTime) {}

	public getTime(): DateTime {
		return this.time;
	}
}
