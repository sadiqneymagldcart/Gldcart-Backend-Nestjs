import {app} from "./app";
import https from 'https'
import selfsigned from 'selfsigned'

const pems = selfsigned.generate([{ name: 'commonName', value: 'localhost' }]);
const credentials = {key: pems.private, cert: pems.cert};

const port: number | string = process.env.PORT || 5000;

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});