import nextRouter from 'next/router';
import { getI18nLng, i18nText } from '@/libs/i18n';

import { isNumeric, removeProps } from './Utils';
import { getWebCallback, setWebData } from './WebUtils';

import { utmKeys } from '@/constants/Configs';
import { RouteChangeOptions, RouteParamOptions, UtilGetRouterQueryOption } from '@/models/CommonModels';

export const encodeURIComp = (str?: string) => {
    str = String(str ?? '');
    try {
        return encodeURIComponent(str);
    } catch {
        return str;
    }
};

export const decodeURIComp = (str = '', strict = false) => {
    if (typeof str !== 'string') str = String(str || '');
    if (!str) {
        return str;
    }
    try {
        return decodeURIComponent(str);
    } catch (error) {
        return strict ? '' : str;
    }
};

export const getSubdomain = (url: string) => {
    try {
        const urlObject = new URL(url || window.location.origin);
        const hostname = urlObject.hostname;
        const domainParts = hostname.split('.');
        if (domainParts.length > 2) {
            const subdomain = domainParts.slice(0, domainParts.length - 2).join('.');
            return subdomain;
        } else {
            return '';
        }
    } catch (error) {
        console.error('Invalid URL:', error);
        return '';
    }
};

export const extractDomainInfo = (origin?: string) => {
    if (!origin) return {};
    let host = origin.split('//').pop() ?? '',
        [hostname, port] = host.split(':'),
        domainParts = hostname.split(':')[0].split('.'),
        isIP = domainParts.slice(0, 4).every(isNumeric),
        subDomain = isIP ? '' : getSubdomain(origin);
    domainParts = domainParts.slice(isIP ? 4 : -(domainParts.length - 1));
    let env = 'stg',
        id = domainParts.join('_'),
        domain = domainParts.join('.');
    switch (domainParts.pop()) {
        case 'localhost':
            env = 'local';
            break;
        case 'vn':
        case 'dev':
            env = 'dev';
            break;
        default:
            break;
    }
    return {
        isLocal: env === 'local',
        isIP,
        env,
        id,
        subDomain,
        domain,
        port: port ? `${parseInt(port)}` : '',
        origin,
    };
};

function getRouterParamPath(path?: string, { e, a, force, redirect, keep }: RouteParamOptions = {}) {
    // e: exclude, a: addition;
    let paramPath = '',
        params: any = {
            // lng: getI18nLng() || 'vi',
        };
    if (keep || e || a || redirect) {
        params = {
            ...(!force && getRouterQuery({ noDynamic: true })),
            ...a,
            // ...(redirect && { redirect: isString(redirect) ? encodeURIComp(window.location[redirect] || redirect) : encodeBase64URI(getRouterAsPath()) }),
            ...params,
        };
    }
    let keys = Object.keys(removeProps(params, e));
    let hadParam = path && path.indexOf('?') > -1;
    if (keys.length > 0) {
        keys.forEach((key, index) => {
            paramPath += (index == 0 ? (hadParam ? '&' : '?') : '&') + `${key}=${params[key]}`;
        });
    }
    return paramPath;
}

export const getRouterQuery = ({ query, multi, decode, noDynamic }: UtilGetRouterQueryOption = {}) => ({
    ...(!noDynamic && nextRouter.query),
    ...Object.fromEntries(
        (query || window.location.search)
            .substring(1)
            .split('&')
            .map((param) => {
                let parts: any[] = param.split('=');
                parts[0] = decodeURIComp(parts[0]);
                if (multi) {
                    parts[1] = parts?.[1]?.split(',').map((i: string) => (decode ? decodeURIComp(i) : i));
                } else {
                    parts[1] = decode ? decodeURIComp(parts[1]) : parts[1];
                }
                return parts;
            })
            .filter((i) => i[0]),
    ),
});
export const getUtmParams = () => {
    let query = getRouterQuery();
    let utm: any = {},
        utmPath: string = '',
        utmTracking: any = {};
    utmKeys.forEach((id: any) => {
        const data = query[id];
        if (data) {
            utm[id.replace('utm_', '')] = data;
            utmPath += `${utmPath ? '&' : ''}${id}=${data}`;
            utmTracking[id] = data;
        }
    });
    return { utm, utmPath, utmTracking };
};

const insertUrlLng = (url: string, lng?: string) => {
    if (!url.includes('lng')) url += `${url.includes('?') ? '&' : '?'}lng=${lng || getI18nLng() || 'vi'}`;
    return url;
};

function handleChangeRoute(type: 'push' | 'replace', path?: string, options?: RouteChangeOptions) {
    let { hash, params, event, forceReRender, search, lng, validate, scrollPageToId } = options || {};
    if (!path) return;

    if (path === 'current') {
        path = window.location.pathname;
    }
    event?.preventDefault();
    const { utmPath } = getUtmParams();
    if (validate) {
        if (window.location.search.includes('changed')) {
            let resp = window.confirm(`${i18nText('change_data')}, ${i18nText('leave_this_page', { type: 'l' })}?`);
            if (!resp) return;
        }
    }
    if (scrollPageToId) {
        const node = document.getElementById(scrollPageToId);
        if (node) {
            getWebCallback('scrollPageToViewId')(scrollPageToId);
            return;
        } else setWebData('scrollPageToId', scrollPageToId);
    }
    return new Promise((resolve) => {
        const { pathname: _pathname, search: _search, hash: _hash } = window.location;
        let url = path + (search || getRouterParamPath(path, params));

        if (hash) {
            url += `#${hash}`;
        }
        if (!url.includes('lng')) url = insertUrlLng(url, lng);
        if (utmPath && !url.includes('utm_')) {
            url += `${!url.includes('?') ? '?' : '&'}${utmPath}`;
        }
        // if (!url.includes('lng')) url += `&lng=${lng || 'vi'}`;
        if (_pathname + _search + _hash === url) return;
        nextRouter[type](url).then(() => {
            // if (forceReRender) getWebCallback('rrr')(true);
            resolve(true);
        });
    });
}

export const pushRoute = (path?: string, options?: RouteChangeOptions) => handleChangeRoute('push', path, options);

export const replaceRoute = (path?: string, options?: RouteChangeOptions) =>
    handleChangeRoute('replace', path, options);

export const openRoute = (path?: string, ...args: any) => {
    if (!path) return;
    let origin = (path.startsWith('http') ? '' : window.location.origin) + path;
    window.open(origin, ...args);
};