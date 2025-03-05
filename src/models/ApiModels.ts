export type UtilApiCommonResponse = {
    error: any;
    data: any;
    payload: any;
    cancelId?: string;
    errorMsg?: string;
    [prop: string]: any;
};

export type UtilApiCommonRequestOption = {
    loading?: boolean;
    delay?: number | boolean;
    debug?: boolean;
    skipValidate?: boolean;
    skipPayload?: boolean;
    error?: boolean;
    isBlobResp?: boolean;
};