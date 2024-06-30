import { Response } from 'express';

export function setRefreshTokenCookie(response: Response, token: string) {
  response.cookie(process.env.REFRESH_TOKEN_NAME!, token, {
    httpOnly: true,
  });
}
