import {inject} from "inversify";
import {Logger} from "../../utils/logger";
import {BaseService} from "../base.service";

export class FileService extends BaseService {
    public constructor(@inject(Logger) logger: Logger) {
        super(logger);
    }

    public async saveFile(filename: any) {
        throw new Error("Method not implemented.");
    }
}
