import { isNumeric } from './Utils';

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
