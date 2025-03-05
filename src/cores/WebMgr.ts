import md5 from 'md5';
import { isFunction, isNumber, isString } from '@/utils/Utils';

export default class WebMgr {
    static instance: any = null;
    static getInstance() {
        if (!WebMgr.instance) WebMgr.instance = new WebMgr();
        return WebMgr.instance;
    }

    // START: variables
    static datas: any = {};
    static debounceTimer: any = {};
    static callbacks: any = {};

    static keyChangeData: any = {};

    public accessToken: string =
        '';

    setToken = (t: string) => (this.accessToken = t);
    getToken = () => this.accessToken;

    setWebCallback = (id: string, cb?: Function): void => {
        WebMgr.callbacks[id] = cb;
    };
    getWebCallback = (id: string): Function => WebMgr.callbacks[id] || (() => null);

    setWebData = (id: string, data: any): void =>
        Object.assign(WebMgr.datas, {
            [id]: (data && (isFunction(data) ? data(WebMgr.datas[id]) : data)) || null,
        });
    deleteWebData = (id: any): void => {
        let ids = id;
        if (isFunction(id)) {
            ids = id(WebMgr.datas);
            if (isString(ids)) ids = [ids];
        }
        ids.forEach((i: any) => delete WebMgr.datas[i]);
    };
    getWebData = (id: string): any => WebMgr.datas[id];

    debounce = (timeout: number, func: Function, skipFirstDebounce?: boolean, _id?: string): void => {
        if (isNumber(timeout) && isFunction(func)) {
            let id = _id ?? md5(func.toString()),
                finalFunc = (notTrigger: boolean) => {
                    !notTrigger && func();
                    WebMgr.debounceTimer[id] = null;
                };
            if (skipFirstDebounce && !WebMgr.debounceTimer[id]) {
                WebMgr.debounceTimer[id] = setTimeout(() => finalFunc(true), timeout);
                return func();
            }
            clearTimeout(WebMgr.debounceTimer[id]);
            WebMgr.debounceTimer[id] = setTimeout(finalFunc, timeout);
        }
    };
    setCrudChanged = (id: string, status?: boolean) => {
        Object.assign(WebMgr.keyChangeData, {
            [id]: !!status,
        });
    };
    getCrudChanged = (id: string) => !!WebMgr.keyChangeData?.[id];

}
