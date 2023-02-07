import 'isomorphic-fetch';
import * as createError from "http-errors";

const API = 'https://shruggr.cloud/api';

export class Cache {
    constructor(private apiKey: string, private localCache: Cache, public debug = false) {}

    async get(key: string): Promise<any> {
        if(!key.startsWith('jig:') && !key.startsWith('berry:')) return
        if(this.debug) console.log('Cache.get:', key);
        let value;
        if(this.localCache) {
            value = await this.localCache.get(key);
        }
        if(!value) {
            const ret = await fetch(`${API}/state/${key}`, {
                method: 'GET',
                headers: {
                    authorization: this.apiKey
                }
            });
    
            if(!ret.ok) {
                throw createError(ret.status, await ret.text())
            }
            value = await ret.json();
        }
        return value;
    }

    async set(key: string, value: any) {
        if(!key.startsWith('jig:') && !key.startsWith('berry:')) return
        const ret = await fetch(`${API}/state/${key}`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify(value),
        });

        if(!ret.ok) {
            throw createError(ret.status, await ret.text())
        }
    }
}