import axios from 'axios';

import { getI18nLng } from '@/libs/i18n';

import { isJSON, isString } from '@/utils/Utils';
import { getToken } from '@/utils/WebUtils';
import { getCookie, getCookieName } from '@/utils/CookieUtils';
import { jwtDecode } from '@/utils/EncryptUtils';

import { REQ_API_TIMEOUT } from '@/constants/Configs';

type TRequest = {
    cancelId?: string;
    body?: any;
    header?: any;
    timeout?: number;
    accessToken?: string;
    responseType?: string;
    noTimeout?: boolean;
    noAuth?: boolean;
    isUpload?: boolean;
};
type TReqHeader = {
    token?: string;
    isAuth?: boolean;
    headers?: any;
};

export default class ApiMgr {
    static instance: any = null;
    static getInstance() {
        if (!ApiMgr.instance) ApiMgr.instance = new ApiMgr();
        return ApiMgr.instance;
    }

    static reqSources: any = {};
    static isRedirectToLoginPage: boolean = false;

    async doRequest(
        method: string,
        url: string,
        {
            cancelId,
            body,
            header,
            timeout,
            noTimeout,
            noAuth,
            accessToken,
            isUpload,
            responseType = 'json',
        }: TRequest = {},
    ) {
        try {
            let reqHeader: any = {
                'Content-Type': isUpload ? 'multipart/form-data' : 'application/json',
                ...header,
            };
            let data = body || '{}';
            let validAccessToken,
                reqUrl = String(url) || '',
                defaultParam = `lng=${getI18nLng() || 'en'}`;
            const { access_token } = getCookie(getCookieName()) || {};
            reqUrl += `${reqUrl.includes('?') ? (reqUrl.endsWith('&') ? '' : '&') : '?'}${defaultParam}`;
            if (!noAuth || accessToken) {
                validAccessToken = await this.validateAccessToken(accessToken || access_token);
                if (validAccessToken) {
                    reqHeader.Authorization = `Bearer ${validAccessToken.token}`;
                }
            }
            if (!noAuth) reqHeader.Authorization = `Bearer ${getToken()}`;
            if (!isUpload && isJSON(body)) data = JSON.stringify(body);
            const reqConfig: any = {
                method,
                data,
                url,
                headers: reqHeader,
                timeout: isUpload || noTimeout ? 0 : (timeout ?? REQ_API_TIMEOUT),
                maxContentLength: 100000000,
                responseType,
            };
            if (cancelId) {
                const reqSrc = axios.CancelToken.source();
                ApiMgr.reqSources[cancelId] = reqSrc;
                reqConfig.cancelToken = reqSrc.token;
            }
            const apiResp: any = await axios.request(reqConfig);
            const result: any = this.validateResponseData(apiResp, responseType);
            this.clearCancelSource(cancelId!);
            return result;
        } catch (error: any) {
            this.clearCancelSource(cancelId!);
            if (error?.response?.data === 'Unauthorized') {
                if (!ApiMgr.isRedirectToLoginPage) {
                    ApiMgr.isRedirectToLoginPage = true;
                    console.log(`[DEBUG] forceLogout ~ Unauthorized!`);
                }
            } else {
                if (error?.code === 'ECONNABORTED') {
                    error.message = 'timeout_exceeded';
                }
                let _error: any = responseType === 'blob' ? { error } : error?.response?.data || error;
                return _error;
            }
        }
    }

    async simpleRequest(method: string, url: string, options: any) {
        const { body } = options || {};
        return new Promise((resolve) => {
            try {
                const reqConfigs = {
                    url,
                    method,
                    timeout: 0,
                    headers: this.getRequestHeader(options),
                    data: body || {},
                };
                axios
                    .request(reqConfigs)
                    .then((res) => {
                        const { status, data } = res;
                        resolve({ status, data });
                    })
                    .catch((error) => {
                        if (error.response) {
                            const { status, data } = error.response;
                            resolve({ status, error: data });
                        } else {
                            resolve({ error: error.message });
                        }
                    });
            } catch (error) {
                resolve({ error });
            }
        });
    }

    async fetchRequest(method: string, url: string, options: any) {
        const { respType = 'json', body, headers, token, isAuth, ...opts } = options || {};
        return new Promise((resolve) => {
            try {
                let requestOptions = {
                    method,
                    redirect: 'follow',
                    ...((headers || method === 'post') && { headers: this.getRequestHeader(options) }),
                    ...(body && { body: JSON.stringify(body) }),
                    ...opts,
                };
                fetch(url, requestOptions)
                    .then((resp) => {
                        if (respType in resp && typeof (resp as any)[respType] === 'function') {
                            return (resp as any)
                                [respType]()
                                .then((data: any) => resolve({ status: resp.status, data }));
                        } else {
                            throw new Error(`Invalid response type: ${respType}`);
                        }
                    })
                    .catch((error) => resolve({ error }));
            } catch (error) {
                resolve({ error });
            }
        });
    }

    cancelRequest(cancelId: string) {
        if (cancelId) ApiMgr.reqSources[cancelId]?.cancel();
    }

    // START: api handler

    validateAccessToken(accessToken: string | undefined): Promise<{ decoded: any; token: string } | undefined> {
        return new Promise((resolve) => {
            let cookieName = getCookieName();
            let webCookie = getCookie(cookieName);
            if (!accessToken) accessToken = webCookie?.access_token;
            if (!accessToken) {
                return resolve(undefined);
            }
            const decoded = jwtDecode(accessToken) || {};
            if (typeof decoded === 'object' && 'exp' in decoded && (decoded.exp ?? 0) * 1000 < Date.now()) {
                if (!ApiMgr.isRedirectToLoginPage) {
                    ApiMgr.isRedirectToLoginPage = true;
                    console.log(`[DEBUG] forceLogout ~ Expired!`);
                    return resolve(undefined);
                }
            } else {
                resolve({ decoded, token: accessToken });
            }
        });
    }

    validateResponseData({ data }: any, responseType: string) {
        try {
            if (responseType === 'json' && isJSON(data)) {
                let jsonData = isString(data) ? JSON.parse(data) : data;
                return jsonData;
            } else {
                return data;
            }
        } catch (error) {
            return error;
        }
    }

    clearCancelSource(cancelId: string) {
        if (cancelId) {
            this.cancelRequest(cancelId);
            delete ApiMgr.reqSources[cancelId];
        }
    }

    getRequestHeader({ token, isAuth, headers }: TReqHeader = {}) {
        return {
            'Content-Type': 'application/json',
            ...((token || isAuth) && { Authorization: `Bearer ${token ?? getToken()}` }),
            ...headers,
        };
    }

    // END: api handler
}
