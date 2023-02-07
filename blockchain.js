"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
require("isomorphic-fetch");
const createError = require("http-errors");
const API = 'https://shruggr.cloud/api';
class Blockchain {
    constructor(apiKey, debug = false) {
        this.apiKey = apiKey;
        this.debug = debug;
        this.network = 'main';
    }
    async broadcast(rawtx) {
        if (this.debug)
            console.log('BROADCAST:', rawtx);
        const ret = await fetch(`${API}broadcast`, {
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
        if (this.debug)
            console.log('RESP:', txid);
        return txid;
    }
    async fetch(txid) {
        if (this.debug)
            console.log('FETCH:', txid);
        const ret = await fetch(`${API}/tx/${txid}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
        const rawtx = Buffer.from(await ret.text(), 'base64').toString('hex');
        return rawtx;
    }
    async utxos(script) {
        if (this.debug)
            console.log('UTXOS:', script);
        const ret = await fetch(`${API}/utxos/${script}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
        const utxos = await ret.json();
        return utxos;
    }
    async spends(txid, vout) {
        if (this.debug)
            console.log('SPENDS:', txid, vout);
        const ret = await fetch(`${API}/spends/${txid}/${vout}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
        const spendTxid = await ret.text();
        return spendTxid;
    }
    time() { }
    async get(key) {
        if (this.debug)
            console.log('GET:', key);
        if (!key.startsWith('jig:'))
            return;
        const ret = await fetch(`${API}/state/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });
        let val;
        if (ret.ok) {
            val = await ret.json();
        }
        else if (ret.status !== 404) {
            throw createError(ret.status, await ret.text());
        }
        return val;
    }
    set() { }
}
exports.Blockchain = Blockchain;
//# sourceMappingURL=blockchain.js.map