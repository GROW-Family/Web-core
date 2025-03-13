import commonLngs from './lngs/common';
import errorLngs from './lngs/error';

const availableLngs: string[] = [];
const lngMappings: any = {};
const webLngs: any = { list: [], map: {} };

const lngs = [
    ['vi', 'vn', 'Tiếng Việt'],
    ['en', 'en', 'English'],
];
webLngs.list = lngs;
lngs.forEach((lng, idx) => {
    availableLngs.push(lng[0]);
    lngMappings[lng[0]] = idx;
    webLngs.map[lng[0]] = lng.slice(1);
});

const isArray = (data: any) => Array.isArray(data);
const isString = (data: any) => typeof data === 'string';

export type I18nInstance = {
    instance: I18nInstance;
};

class I18nMgr {
    static instance?: I18nMgr | null = null;
    static getInstance() {
        if (!I18nMgr.instance) I18nMgr.instance = new I18nMgr();
        return I18nMgr.instance;
    }

    static lng = 'vi';
    static cbs: any = {};
    static leadedLngs: any = { ...commonLngs, ...errorLngs };

    setLng(lng: string) {
        if (availableLngs.includes(lng)) {
            let isChanged = I18nMgr.lng !== lng;
            I18nMgr.lng = lng;
            isChanged && Object.values(I18nMgr.cbs).forEach((cb: any) => cb?.(lng));
        }
    }
    getLng() {
        return I18nMgr.lng;
    }
    getLngIdx() {
        return lngMappings[I18nMgr.lng];
    }

    onChangeLng(id: string, cb?: Function) {
        if (id && typeof cb === 'function') {
            I18nMgr.cbs[id] = cb;
        }
    }
    rmChangeLng(id: string) {
        delete I18nMgr.cbs[id];
    }

    getLeadedLng = (id?: string) => (id ? I18nMgr.leadedLngs[id] : I18nMgr.leadedLngs);
    setLeadedLng = (id: string, data: any) => (I18nMgr.leadedLngs[id] = data);

    getText = (...args: any) => {
        let _args: any[] = [...args];
        if (isArray(args[0])) {
            _args[0] = args[0][0];
            _args[1] = args[0][1];
        }
        return textHandler(_args[0], _args[1], I18nMgr.leadedLngs);
    };
}

const i18nInstance = I18nMgr.getInstance();

function capitalize(str: string, all?: any) {
    let a = str.trim(),
        func = function (t: string) {
            return t.charAt(0).toUpperCase() + t.slice(1);
        };
    return all ? a.split(' ').map(func).join(' ') : func(a);
}

function textTransform(type: string, str = '') {
    str = String(str);
    switch (type) {
        case 'lf':
            return str[0].toLowerCase() + str.substring(1);
        case 'l':
            return str.toLowerCase();
        case 'u':
            return str.toUpperCase();
        case 'c':
            return capitalize(str);
        case 'ca':
            return capitalize(str, true);
        default:
            return str;
    }
}

const textHandler = function (id: string, opts?: any, datas?: any) {
    let { t, n, f, s, i, as = '', ae = '', m, li = '', st, ...keys } = opts || {};
    // t: type, pass to util textTransform
    // n: giá trị number của đa ngôn ngữ cần dùng dạng số nhiều trong tiếng anh
    // f: formater, function
    // s: strict, không return id của keyword nếu ko có text tồn tại
    // as: addition start, string + thêm phía trước của text
    // ae: addition end, string + thêm phía sau của text
    // i: ignore
    // m: module
    // li: language index
    // st: single text
    if (i) return id;
    let text: any,
        lngIdx = String(li) ? li : i18nInstance.getLngIdx();
    if (id) {
        if (/[@\s]/.test(id)) return id;
        let _id = String(id).split('.');
        _id.forEach((_i, _idx) => {
            if (typeof text === 'undefined') {
                if (st) {
                    return (text = (datas || getI18nLeadedLng())[_i]);
                } else {
                    if (m) text = getI18nLeadedLng(m)?.[_i];
                    if (!m || (m && !text)) text = (datas || getI18nLeadedLng())[_i];
                }
            } else if (typeof text === 'object') {
                text = text[_i];
            }
            if (text && _idx === _id.length - 1) {
                text = isString(text) ? text : text[lngIdx];
            }
        });
        if (isArray(text)) {
            text = text[+!!(typeof n === 'number' && n > 0 ? n : 0)];
        }
        if (isString(text)) {
            if (text && keys) {
                Object.entries(keys).forEach(([key, value]: any) => {
                    let keyValue = value;
                    if (isArray(value)) {
                        let keyParams: any[] = [value[0], value[1], datas];
                        // @ts-ignore
                        keyValue = this ? this.t(...keyParams) : textHandler(...keyParams);
                    }
                    text = text.replace(new RegExp(`{\\{${key}}}`, 'g'), keyValue);
                });
            }
        } else text = '';
        if (t) text = textTransform(t, text);
        if (f) text = f(text);
    }
    return as + (text || (s || !id ? '' : id)) + ae;
};

export const i18nText = (id?: string | any[], opts?: any) => i18nInstance.getText(id, opts);
export const getI18n = (datas?: any) => ({ t: (...args: any) => textHandler(args[0], args[1], datas) });

export const setI18nLng = (lng: string) => i18nInstance.setLng(lng);
export const getI18nLng = () => i18nInstance.getLng();
export const onI18nChangeLng = (id: string, cb?: Function) => i18nInstance.onChangeLng(id, cb);
export const rmI18nChangeLng = (id: string) => i18nInstance.rmChangeLng(id);
export const getI18nLeadedLng = (id?: string) => i18nInstance.getLeadedLng(id);
export const setI18nLeadedLng = (id: string, data: any) => i18nInstance.setLeadedLng(id, data);

export { availableLngs, lngMappings, webLngs };
