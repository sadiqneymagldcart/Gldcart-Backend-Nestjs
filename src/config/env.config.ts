import * as dotenv from "dotenv";

export function loadEnvironmentVariables() {
    let path: string = ".env";
    if (process.env.NODE_ENV === "production") {
        path = ".env.production";
        console.log("Using production environment variables");
    }
    dotenv.config({ path: path });
}
