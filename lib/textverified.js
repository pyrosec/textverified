"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextVerifiedClient = void 0;
const axios_1 = __importDefault(require("axios"));
class TextVerifiedClient {
    constructor(o) {
        this.simpleAccessToken = o.simpleAccessToken;
        this.bearer = o.bearer || null;
        this.pendingId = o.pendingId || null;
    }
    toObject() {
        return {
            simpleAccessToken: this.simpleAccessToken,
            pendingId: this.pendingId,
            bearer: this.bearer,
        };
    }
    toJSON() {
        return JSON.stringify(this.toObject(), null, 2);
    }
    static fromObject(o) {
        return new this(o);
    }
    static fromJSON(s) {
        return this.fromObject(JSON.parse(s));
    }
    async _call(method, pathname, data = {}, headers = {}) {
        try {
            const headersCombined = Object.assign({}, headers || {}, this.bearer
                ? {
                    Authorization: "Bearer " + this.bearer.bearer_token,
                }
                : {});
            if (method === "post")
                return await axios_1.default[method](this.constructor.BASE_URL + pathname, data, {
                    headers: headersCombined,
                    responseType: "json",
                });
            else
                return await axios_1.default[method](this.constructor.BASE_URL + pathname, {
                    headers: headersCombined,
                    params: data,
                });
        }
        catch (e) {
            if (e.code === "Z_BUF_ERROR")
                return await this._call(method, pathname, data, headers);
            else
                throw e;
        }
    }
    async getAllTargets() {
        const response = await this._call("get", "/api/targets");
        return response.data;
    }
    async getPending() {
        const response = await this._call("get", "/api/Verifications/Pending");
        return response.data;
    }
    async createVerification({ id, areaCode, requestedTimeAllotment }) {
        const response = await this._call("post", "/api/Verifications", {
            id,
            areaCode,
            requestedTimeAllotment,
        });
        this.pendingId = response.data.id;
        return response.data;
    }
    async getTarget({ id }) {
        const response = await this._call("get", "/api/Targets/" + id);
        return response.data;
    }
    async getVerification({ id }) {
        const response = await this._call("get", "/api/Verifications/" + (id || this.pendingId));
        return response.data;
    }
    async simpleAuthenticate() {
        const response = await this._call("post", "/Api/SimpleAuthentication", {}, {
            "X-SIMPLE-API-ACCESS-TOKEN": this.simpleAccessToken,
        });
        this.bearer = response.data;
        return response;
    }
    async authenticate() {
        const response = await this._call("post", "/Api/Authentication");
        return response;
    }
}
exports.TextVerifiedClient = TextVerifiedClient;
TextVerifiedClient.BASE_URL = "https://www.textverified.com";
//# sourceMappingURL=textverified.js.map