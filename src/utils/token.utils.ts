import * as express from "express";

export function setRefreshTokenCookie(response: express.Response, token: string) {
    response.cookie("refreshToken", token, {
        httpOnly: true,
        maxAge: Number(process.env.COOKIES_MAX_AGE),
    });
}
