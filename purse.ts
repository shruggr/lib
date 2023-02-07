import 'isomorphic-fetch';
import * as createError from "http-errors";

const API = 'https://shruggr.cloud/api';

export class Purse {
    constructor(private apiKey: string, public debug = false) {}

    async pay (rawtx: string): Promise<string> {
        if(this.debug) console.log('PAY:', rawtx);
        const ret = await fetch(`${API}/pay`, {
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
        return Buffer.from(b64, 'base64').toString('hex');
    }
}