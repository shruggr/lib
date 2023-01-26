"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
require("isomorphic-fetch");
const createError = require("http-errors");
class Blockchain {
    constructor(api, apiKey) {
        this.api = api;
        this.apiKey = apiKey;
        this.network = 'main';
    }
    async broadcast(rawtx) {
        console.log('BROADCAST:', rawtx);
        const ret = await fetch(`${this.api}/broadcast`, {
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
        const txid = await ret.text();
        console.log('RESP:', txid);
        return txid;
    }
    async fetch(txid) {
        console.log('FETCH:', txid);
        const ret = await fetch(`${this.api}/tx?txid=${txid}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
        const rawtx = Buffer.from(await ret.text(), 'base64').toString('hex');
        // console.log('RESP:', rawtx)
        return rawtx;
    }
    async utxos(script) {
        console.log('UTXOS:', script);
        const ret = await fetch(`${this.api}/utxos?script=${script}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
        const utxos = await ret.json();
        console.log('RESP:', utxos);
        return utxos;
    }
    async spends(txid, vout) {
        console.log('SPENDS:', txid, vout);
        const ret = await fetch(`${this.api}/spends?txid=${txid}&vout=${vout}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
        const spendTxid = await ret.text();
        console.log('RESP:', spendTxid);
        return spendTxid;
    }
    time() { }
}
exports.Blockchain = Blockchain;
//# sourceMappingURL=blockchain.js.map