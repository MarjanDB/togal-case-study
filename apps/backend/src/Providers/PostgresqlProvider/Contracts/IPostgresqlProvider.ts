import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IPostgresqlProvider {
	public abstract query<ResponseType>(query: string, params: unknown[], validator: (value: unknown) => ResponseType): Promise<ResponseType>;
}
