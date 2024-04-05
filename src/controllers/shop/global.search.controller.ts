import * as express from "express";
import { inject } from "inversify";
import { SearchService } from "@services/shop/global.search.service";
import { controller, httpGet } from "inversify-express-utils";

@controller("/search")
export class SearchController {
    private readonly searchService: SearchService;

    public constructor(@inject(SearchService) searchService: SearchService) {
        this.searchService = searchService;
    }

    @httpGet("/")
    public async searchGlobally(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction,
    ) {
        try {
            const query = request.query.query as string;
            const result = await this.searchService.searchGlobally(query);
            response.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
