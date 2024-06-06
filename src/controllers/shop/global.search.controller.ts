import * as express from "express";
import { inject } from "inversify";
import { SearchService } from "@services/shop/global-search.service";
import {
    BaseHttpController,
    controller,
    httpGet,
} from "inversify-express-utils";
import { AuthenticationMiddleware } from "@middlewares/authentication.middleware";

@controller("/search", AuthenticationMiddleware)
export class SearchController extends BaseHttpController {
    private readonly searchService: SearchService;

    public constructor(@inject(SearchService) searchService: SearchService) {
        super();
        this.searchService = searchService;
    }

    @httpGet("/")
    public async searchGlobally(request: express.Request): Promise<void> {
        const query = request.query.query as string;
        const result = await this.searchService.searchGlobally(query);
        this.ok(result);
    }
}
