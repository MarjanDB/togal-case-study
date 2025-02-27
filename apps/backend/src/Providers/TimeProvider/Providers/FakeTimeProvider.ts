import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { ITimeProvider } from "Providers/TimeProvider/Contracts/ITimeProvider";

@Injectable()
export class FakeTimeProvider implements ITimeProvider {
	public constructor(private readonly time: DateTime) {}

	public getTime(): DateTime {
		return this.time;
	}
}
