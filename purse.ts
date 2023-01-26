import 'isomorphic-fetch';
import * as createError from "http-errors";

export class Purse {
    constructor(public api: string, private apiKey: string, private doBroadcast = true) {}

    async pay (rawtx: string): Promise<string> {
        console.log('PAY:', rawtx);
        const ret = await fetch(`${this.api}/pay`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({rawtx: Buffer.from(rawtx, 'hex').toString('base64')}),
        });

        if(!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const b64 = await ret.text();
        console.log("RET:", b64);
        const payedTx = Buffer.from(b64, 'base64').toString('hex');

        return payedTx;
    }

    async broadcast(rawtx: string) {
        if(!this.doBroadcast) return;
        const ret = await fetch(`${this.api}/broadcast`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({rawtx: Buffer.from(rawtx, 'hex').toString('base64')}),
        });

        return ret.text();
    }
}