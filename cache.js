"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
require("isomorphic-fetch");
const createError = require("http-errors");
const API = 'https://shruggr.cloud/api';
class Cache {
    constructor(apiKey, localCache, debug = false) {
        this.apiKey = apiKey;
        this.localCache = localCache;
        this.debug = debug;
    }
    async get(key) {
        if (!key.startsWith('jig:') && !key.startsWith('berry:'))
            return;
        if (this.debug)
            console.log('Cache.get:', key);
        let value;
        if (this.localCache) {
            value = await this.localCache.get(key);
        }
        if (!value) {
            const ret = await fetch(`${API}/state/${key}`, {
                method: 'GET',
                headers: {
                    authorization: this.apiKey
                }
            });
            if (!ret.ok) {
                throw createError(ret.status, await ret.text());
            }
            value = await ret.json();
        }
        return value;
    }
    async set(key, value) {
        if (!key.startsWith('jig:') && !key.startsWith('berry:'))
            return;
        const ret = await fetch(`${API}/state/${key}`, {
            method: 'POST',
            headers: {
                authorization: this.apiKey,
                "content-type": "application/json"
            },
            body: JSON.stringify(value),
        });
        if (!ret.ok) {
            throw createError(ret.status, await ret.text());
        }
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map