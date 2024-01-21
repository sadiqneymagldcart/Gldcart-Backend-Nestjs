import {Router} from 'express';

export interface IRoutes {
    path: string;
    router: Router;

    initializeRoutes(): void;
}
