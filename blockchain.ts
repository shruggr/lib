import { TXO } from './types';
import 'isomorphic-fetch';
import * as createError from "http-errors";

export class Blockchain {
    network = 'main';
    constructor(public api: string, private apiKey: string) { }

    async broadcast(rawtx: string): Promise<string> {
        console.log('BROADCAST:', rawtx);
        const ret = await fetch(`${this.api}/broadcast`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify({rawtx: Buffer.from(rawtx, 'hex').toString('base64')}),
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const txid = await ret.text();
        console.log('RESP:', txid);
        return txid;
    }

    async fetch(txid: string): Promise<string> {
        console.log('FETCH:', txid);
        const ret = await fetch(`${this.api}/tx?txid=${txid}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const rawtx = Buffer.from(await ret.text(), 'base64').toString('hex');
        // console.log('RESP:', rawtx)
        return rawtx;
    }

    async utxos(script: string): Promise<TXO[]> {
        console.log('UTXOS:', script);
        const ret = await fetch(`${this.api}/utxos?script=${script}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const utxos = await ret.json();
        console.log('RESP:', utxos);
        return utxos;
    }

    async spends(txid: string, vout: number) {
        console.log('SPENDS:', txid, vout);
        const ret = await fetch(`${this.api}/spends?txid=${txid}&vout=${vout}`, {
            method: 'GET',
            headers: {
                authorization: this.apiKey
            }
        });

        if (!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
        const spendTxid = await ret.text();
        console.log('RESP:', spendTxid);
        return spendTxid;
    }

    time() { }
}