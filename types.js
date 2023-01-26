"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TXO = void 0;
class TXO {
    constructor(data) {
        this.txid = "";
        this.vout = 0;
        this.sats = 0;
        this.script = "";
        this.spend = "";
        this.lock = 0;
        Object.assign(this, data);
    }
    toObject() {
        return Object.assign({}, this);
    }
}
exports.TXO = TXO;
;
//# sourceMappingURL=types.js.map