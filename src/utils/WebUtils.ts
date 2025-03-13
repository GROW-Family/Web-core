import WebMgr from "@/cores/WebMgr";

const WebInstance = WebMgr.getInstance();

export const setToken = (t: string) => WebInstance.setToken(t);
export const getToken = () => WebInstance.getToken();

export const getWebDomain = (type: string) => WebInstance.getWebDomain(type);
export const getSubDomain = () => WebInstance.getSubDomain();

export const setWebCallback = (...args: any) => WebInstance.setWebCallback(...args);
export const getWebCallback = (...args: any) => WebInstance.getWebCallback(...args);
export const setWebData = (...args: any) => WebInstance.setWebData(...args);
export const getWebData = (...args: any) => WebInstance.getWebData(...args);
export const deleteWebData = (...args: any) => WebInstance.deleteWebData(...args);
export const debounce = (timeout: number, func: Function, skipFirstDebounce?: boolean, _id?: string) =>
    WebInstance.debounce(timeout, func, skipFirstDebounce, _id);