import { Response } from 'express';

export function setRefreshTokenCookie(response: Response, token: string): void {
  const refreshTokenName = process.env.refreshToken_NAME;

  if (!refreshTokenName) {
    throw new Error(
      'refreshToken_NAME is not set in the environment variables.',
    );
  }

  response.cookie(refreshTokenName, token, {
    httpOnly: true, // cookie is not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // secure cookie in production
    sameSite: 'strict', // helps against CSRF attacks
  });
}
