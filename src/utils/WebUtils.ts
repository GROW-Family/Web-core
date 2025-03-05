import WebMgr from "@/cores/WebMgr";

const WebInstance = WebMgr.getInstance();

export const setToken = (t: string) => WebInstance.setToken(t);
export const getToken = () => WebInstance.getToken();

export const getWebDomain = (type: string) => WebInstance.getWebDomain(type);
