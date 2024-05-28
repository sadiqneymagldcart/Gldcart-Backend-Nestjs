import { inject, injectable } from "inversify";
import { Logger } from "@utils/logger";

@injectable()
export abstract class BaseService {
    protected logger: Logger;

    public constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;
    }
}
