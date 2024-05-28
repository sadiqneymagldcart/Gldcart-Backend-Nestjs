import { Logger } from "@utils/logger";
import { inject, injectable } from "inversify";
import { BaseService } from "./base.service";

@injectable()
export class TestService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async test(id: string): Promise<string> {
        if(id !== "123")
            throw new Error("Invalid id");
        return id;
    }
}
