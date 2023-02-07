import { TXO } from './types';
import 'isomorphic-fetch';
import * as createError from "http-errors";

const API = 'https://shruggr.cloud/api';
export class Blockchain {
    network = 'main';
    constructor(private apiKey: string, public debug = false) { }

    async broadcast(rawtx: string): Promise<string> {
        if (this.debug) console.log('BROADCAST:', rawtx);
        const ret = await fetch(`${API}broadcast`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({ rawtx: Buffer.from(rawtx, 'hex').toString('base64') }),
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const txid = await ret.text();
        if (this.debug) console.log('RESP:', txid);
        return txid;
    }

    async fetch(txid: string): Promise<string> {
        if (this.debug) console.log('FETCH:', txid);
        const ret = await fetch(`${API}/tx/${txid}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const rawtx = Buffer.from(await ret.text(), 'base64').toString('hex');
        return rawtx;
    }

    async utxos(script: string): Promise<TXO[]> {
        if (this.debug) console.log('UTXOS:', script);
        const ret = await fetch(`${API}/utxos/${script}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const utxos = await ret.json();
        return utxos;
    }

    async spends(txid: string, vout: number) {
        if (this.debug) console.log('SPENDS:', txid, vout);
        const ret = await fetch(`${API}/spends/${txid}/${vout}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const spendTxid = await ret.text();
        return spendTxid;
    }

    time() { }

    async get(key: string) {
        if (this.debug) console.log('GET:', key)
        if (!key.startsWith('jig:')) return
        const ret = await fetch(`${API}/state/${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        })

        let val: any
        if (ret.ok) {
            val = await ret.json()
        } else if (ret.status !== 404) {
            throw createError(ret.status, await ret.text())
        }

        return val
    }

    set() { }
}