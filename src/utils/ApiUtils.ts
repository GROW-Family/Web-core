import { AppRespCodes } from '@/constants/RespCode';

import { isArray, isBoolean, miniTimer } from './Utils';
import { getDelayTime, getTimestamp } from './DateUtils';

import { UtilApiCommonRequestOption, UtilApiCommonResponse } from '@/models/ApiModels';

export const validateApiResp = (resp: any, skipPayload?: any) =>
    (resp?.status_code ?? resp?.statusCode) === AppRespCodes.SUCCESS &&
    (skipPayload ? true : (resp.pagination ?? resp.payload));

export const apiCommonRequest = async (
    api: Function,
    params: any,
    { loading, delay, debug, skipValidate, skipPayload, error, isBlobResp }: UtilApiCommonRequestOption = {},
): Promise<UtilApiCommonResponse> => {
    let result,
        reqAt = getTimestamp();
    try {
        let data = await api(...(isArray(params) ? params : [params]));
        if (isBlobResp) {
            const { error } = data || {};
            result = { payload: data, error };
        } else if (skipValidate) {
            result = { ...data, cancelId: params?.cancelId };
        } else if (validateApiResp(data, skipPayload)) {
            result = {
                ...data,
                payload: data.payload,
                cancelId: params?.cancelId,
            };
        } else throw data;
    } catch (_error) {
        if (debug) console.log(`🚀 : apiCommonRequest -> error`, _error);
        result = { error: _error };
    }
    if (delay) await miniTimer(getDelayTime(reqAt, 'ms', isBoolean(delay) ? 500 : delay));
    if (result.error) {
        console.log("error", result.error)
    }
    return result;
};
