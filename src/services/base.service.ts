import {inject, injectable} from "inversify";
import {Logger} from "../utils/logger";

@injectable()
export class BaseService {
    protected logger: Logger;

    constructor(@inject(Logger) logger: Logger) {
        this.logger = logger;
    }
}
