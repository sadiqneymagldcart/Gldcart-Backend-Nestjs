import {Response} from 'express';

export function setRefreshTokenCookie(response: Response, token: string) {
    response.cookie("refreshToken", token, {
        httpOnly: true,
        maxAge: Number(process.env.COOKIES_MAX_AGE),
    });
}