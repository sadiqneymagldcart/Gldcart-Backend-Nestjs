import { inject } from "inversify";
import {
    httpGet,
    controller,
    request,
    Controller,
    httpPost,
    BaseHttpController,
} from "inversify-express-utils";
import * as express from "express";
import { TestService } from "@services/base/test.service";

@controller("/test")
export class TestController extends BaseHttpController implements Controller {
    private readonly testService: TestService;

    public constructor(@inject(TestService) testService: TestService) {
        super();
        this.testService = testService;
    }

    @httpGet("/")
    public async index(
        @request() req: express.Request,
    ): Promise<string> {
        const id = req.query.id as string;
        return this.testService.test(id);
    }

    @httpPost("/")
    public async createId(
        @request() req: express.Request,
    ): Promise<string> {
        const id = req.query.id as string;
        return this.testService.test(id);
    }
}
