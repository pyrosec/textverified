interface IBearer {
    bearer_token: string;
    expiration: string;
    ticks: number;
}
export declare class TextVerifiedClient {
    static BASE_URL: string;
    bearer: null | IBearer;
    simpleAccessToken: string;
    pendingId: string | null;
    constructor(o: any);
    toObject(): {
        simpleAccessToken: string;
        pendingId: string;
        bearer: IBearer;
    };
    toJSON(): string;
    static fromObject(o: any): TextVerifiedClient;
    static fromJSON(s: any): TextVerifiedClient;
    _call(method: any, pathname: any, data?: {}, headers?: {}): any;
    getAllTargets(): Promise<any>;
    getPending(): Promise<any>;
    createVerification({ id, areaCode, requestedTimeAllotment }: {
        id: any;
        areaCode: any;
        requestedTimeAllotment: any;
    }): Promise<any>;
    getTarget({ id }: {
        id: any;
    }): Promise<any>;
    getVerification({ id }: {
        id: any;
    }): Promise<any>;
    simpleAuthenticate(): Promise<any>;
    authenticate(): Promise<any>;
}
export {};
