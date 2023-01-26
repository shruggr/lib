"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purse = void 0;
require("isomorphic-fetch");
const createError = require("http-errors");
class Purse {
    constructor(api, apiKey, doBroadcast = true) {
        this.api = api;
        this.apiKey = apiKey;
        this.doBroadcast = doBroadcast;
    }
    async pay(rawtx) {
        console.log('PAY:', rawtx);
        const ret = await fetch(`${this.api}/pay`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({ rawtx: Buffer.from(rawtx, 'hex').toString('base64') }),
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
        const b64 = await ret.text();
        console.log("RET:", b64);
        const payedTx = Buffer.from(b64, 'base64').toString('hex');
        return payedTx;
    }
    async broadcast(rawtx) {
        if (!this.doBroadcast)
            return;
        const ret = await fetch(`${this.api}/broadcast`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({ rawtx: Buffer.from(rawtx, 'hex').toString('base64') }),
        });
        return ret.text();
    }
}
exports.Purse = Purse;
//# sourceMappingURL=purse.js.map