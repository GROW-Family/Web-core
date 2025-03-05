import Cookies from 'js-cookie';
import { JwtPayload } from 'jsonwebtoken';

import { jwtDecode } from './EncryptUtils';
import { isJSON, toJSON } from './Utils';
import { getWebDomain } from './WebUtils';

import { cookieProps, sourceVersion } from '@/constants/Configs';

export const isValidAuth = (accessToken: any): boolean => {
    let _accessToken: JwtPayload | null = null;

    if (accessToken) {
        const decoded = jwtDecode(accessToken);
        if (typeof decoded === 'object' && decoded !== null) {
            _accessToken = decoded as JwtPayload;
        }
    } else {
        let cookieName = getCookieName();
        let webCookie = getCookie(cookieName);
        const decoded = jwtDecode(webCookie?.access_token);
        if (typeof decoded === 'object' && decoded !== null) {
            _accessToken = decoded as JwtPayload;
        }
    }

    return !!_accessToken && typeof _accessToken.exp === 'number' && _accessToken.exp * 1000 > Date.now() + 60000;
};
export const getCookieName = (hostname?: string) => {
    let key = hostname || window.location.hostname;
    return String(key).split('.').join('_');
};

export const getCookie = (cookieName: string) => {
    let cookie = toJSON(Cookies.get(cookieName));
    if (!cookie) return;

    let _cookie: Record<string, any> = {};

    Object.keys(cookie).forEach((prop) => {
        if (cookieProps.get.hasOwnProperty(prop)) {
            _cookie[(cookieProps.get as Record<string, string>)[prop]] = cookie[prop];
        }
    });

    return _cookie;
};

export const setCookie = (cookieName: string, content?: any, options?: any) => {
    let cookie: Record<string, any> = {};
    let _content = { sourceVersion, origin: 'landing', ...content };

    if (_content) {
        Object.keys(_content).forEach((prop) => {
            if (cookieProps.set.hasOwnProperty(prop)) {
                cookie[(cookieProps.set as Record<string, string>)[prop]] = _content[prop];
            }
        });
    }

    let option = {
        sameSite: 'lax',
        domain: getCookieDomain(),
        ...options,
    };

    Cookies.set(cookieName, JSON.stringify(cookie), option);
};

export const updateCookie = (cookieName: string, content: any, options: any) => {
    let curCookie = getCookie(cookieName);
    setCookie(cookieName, { ...curCookie, ...content }, options);
};

export const removeCookie = (name: string, options?: any) => {
    Cookies.remove(name || '', { ...options });
    Cookies.remove(name || '', { domain: getCookieDomain(), ...options });
};

export const validateCookie = (hostname: string) => {
    let allCookie = Cookies.get(),
        cookieKeys = Object.keys(allCookie),
        domainKey = getCookieDomain('_');

    let otherCookies = cookieKeys.filter(
        (i) => i !== `admin_${domainKey}` && i !== hostname && !i.startsWith('sso') && i.endsWith(domainKey),
    );

    let removeCookies = otherCookies
        .reduce<{ key: string; cookie: Record<string, any> }[]>((arrs, name) => {
            let cookie = allCookie[name];
            if (cookie && isJSON(cookie)) {
                let parsedCookie = toJSON(cookie);
                arrs.push({ key: name, cookie: parsedCookie });
            }
            return arrs;
        }, [])
        .sort((a, b) => (b.cookie['8'] || 0) - (a.cookie['8'] || 0))
        .slice(2)
        .map((i) => i.key);

    if (removeCookies.length > 0) {
        removeCookies.forEach((name) => {
            setCookie(name, {});
            removeCookie(name);
        });
    }
};

export const resetCookie = (hadSourceVersion: any, cb = () => null) => {
    if (!hadSourceVersion) return cb();
    let allCookie = Cookies.get(),
        cookieKeys = Object.keys(allCookie),
        domainKey = getWebDomain('key');
    let otherCookies = cookieKeys.filter((i) => i !== `admin_${domainKey}`);
    otherCookies.forEach((item, index) => {
        removeCookie(item);
        if (index === otherCookies.length - 1) cb();
    });
};

export const parseContentCookie = (cookieStr: string) => {
    let cookie = toJSON(cookieStr);
    if (!cookie) return;

    let _cookie: Record<string, any> = {};
    Object.keys(cookie).forEach((prop) => {
        if (prop in cookieProps.get) {
            const key = prop as keyof typeof cookieProps.get;
            _cookie[cookieProps.get[key]] = cookie[key];
        }
    });

    return _cookie;
};

export const initCookies = () => {
    let _cookies = Cookies.get();
    let domain = getCookieDomain('_');
    let allCookies = Object.keys(_cookies)
        .reduce<(string | Record<string, any>)[]>((rs, id) => {
            if (id.includes(domain)) {
                let data = parseContentCookie(decodeURIComponent(_cookies[id]));
                if (data && data.access_token) rs.push([id, data]);
            }
            return rs;
        }, [])
        .reverse();
    return allCookies;
};

export const getCookieDomain = (delimiter = '.') => {
    let { host, hostname } = window.location || {};
    return (host.includes('localhost') ? 'localhost' : hostname).replaceAll('.', delimiter);
};

export const forceLogout = (msg: string) => {
    if (msg) window.alert(msg);
    removeCookie(getCookieName());
};
