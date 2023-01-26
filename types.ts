import { Address, KeyPair } from "@ts-bitcoin/core";

export class TXO {
    txid: string = "";
    vout: number = 0;
    sats: number = 0;
    script: string = "";
    spend: string = "";
    lock: number = 0;

    constructor(data: Partial<TXO>) {
        Object.assign(this, data);
    }

    toObject() {
        return Object.assign({}, this);
    }
}

export interface IUser {
    id: string;
    kp: KeyPair;
    address: Address;
    isAdmin: boolean;
};