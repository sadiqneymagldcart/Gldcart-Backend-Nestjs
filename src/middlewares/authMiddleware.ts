import { Request, Response, NextFunction } from 'express';
import {ApiError} from '../exceptions/api-error';
import {container} from "../server";
import {TokenService} from "../services/token/tokenService";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authorizationHeader = req.headers.authorization as string;

  if (!authorizationHeader) {
    console.log("no access token was provided");
    return next(ApiError.UnauthorizedError());
  }

  const accessToken = authorizationHeader.split(' ')[1];
  if (!accessToken) {
    console.log("invalid access token");
    return next(ApiError.UnauthorizedError());
  }
  const userData = container.get(TokenService).validateAccessToken(accessToken);

  if (!userData) {
    return next(ApiError.UnauthorizedError());
  }
  res.locals.user = userData;
  next();
};
