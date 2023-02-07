"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Purse = void 0;
require("isomorphic-fetch");
const createError = require("http-errors");
const API = 'https://shruggr.cloud/api';
class Purse {
    constructor(apiKey, debug = false) {
        this.apiKey = apiKey;
        this.debug = debug;
    }
    async pay(rawtx) {
        if (this.debug)
            console.log('PAY:', rawtx);
        const ret = await fetch(`${API}/pay`, {
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
        return Buffer.from(b64, 'base64').toString('hex');
    }
}
exports.Purse = Purse;
//# sourceMappingURL=purse.js.map