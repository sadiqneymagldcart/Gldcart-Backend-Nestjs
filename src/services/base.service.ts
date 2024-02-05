import {inject, injectable} from "inversify";
import {Logger} from "../utils/logger";

@injectable()
export class BaseService {
    protected logger: Logger;

    public constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;
    }
}
