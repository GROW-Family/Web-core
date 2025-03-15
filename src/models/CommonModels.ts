export type I18nProp = {
    t: Function;
    j: Function;
    lng: string;
    lngId: string;
};

export type HocsProps<Classes> = {
    classes: Classes;
    i18n: I18nProp;
};


export type RouteChangeOptions = {
    hash?: string;
    params?: object;
    event?: Event;
    forceReRender?: boolean;
    search?: string;
    lng?: string;
    validate?: boolean;
    scrollPageToId?: string;
};

export type UtilGetRouterQueryOption = {
    query?: string;
    multi?: boolean;
    decode?: boolean;
    noDynamic?: boolean;
};

export type RouteParamOptions = {
    e?: string;
    a?: object;
    force?: boolean;
    redirect?: string;
    keep?: boolean;
};