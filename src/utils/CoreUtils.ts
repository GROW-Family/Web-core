import { useCallback, useEffect, useRef } from "react";
import ApiMgr from "@/cores/ApiMgr";

const apiInstance = ApiMgr.getInstance();

export const doRequest = (...args: any) => apiInstance.doRequest(...args);
export const simpleRequest = (...args: any) => apiInstance.simpleRequest(...args);
export const fetchRequest = (...args: any) => apiInstance.fetchRequest(...args);
export const cancelRequest = (cancelId?: string | null) => apiInstance.cancelRequest(cancelId);

export const useIsMounted = () => {
    const isMounted = useRef(false);
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);
    return useCallback(() => isMounted.current, []);
};

export const preventDefaultClickEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
};