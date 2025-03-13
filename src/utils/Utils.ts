import _cloneDeep from 'lodash/cloneDeep';
import _isEmpty from 'lodash/isEmpty';
import _uniq from 'lodash/uniq';
import _uniqBy from 'lodash/uniqBy';
import fastCompare from 'react-fast-compare'; // This is a fork of the brilliant fast-deep-equal with some extra handling for React.
import { v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import { toCaseStyle } from './StringUtils';

import { domains } from '@/constants/Domain';

export const isUndefined = (value: any): boolean =>
    ['undefined', 'NaN', undefined, '', null, 'null', false, 'false', 'Invalid date', Infinity].includes(value);

export const isEmail = (value: any): boolean =>
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(value).toLowerCase(),
    );

export const isCharacter = (value: any): boolean => /[a-zA-Z]/.test(value);

export const isString = (value: any): boolean => typeof value === 'string';

export const isNumber = (value: any): boolean =>
    typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)));

export const isNumeric = (value: any): boolean => /^[\d]+$/.test(value);

export const isBoolean = (value: any): boolean => typeof value === 'boolean';

export const isObject = (value: any, isNotEmpty?: boolean): boolean => {
    let isObj = !!value && typeof value === 'object' && !isUndefined(value);
    return isObj && isNotEmpty ? !isEmpty(value) : isObj;
};

export const isCheckNaN = (value: any) => isNaN(value) && value !== undefined;

export const isEmpty = (obj: any): boolean => _isEmpty(obj);

export const isFile = (file: any): boolean => `${file}` === '[object File]';

export const isArray = (value: any, minLength?: number | boolean): boolean =>
    Array.isArray(value) && (minLength ? value.length >= (typeof minLength === 'number' ? minLength : 1) : true);

export const randomArray = (arr: any): any => _cloneDeep(arr[Math.floor(Math.random() * arr.length)]);

export const toArray = (value: any): any[] => (Array.isArray(value) ? value : []);

export const isHaveValue = (data: any, value?: any, isArr?: boolean): boolean => {
    if (!data || (isArr && !isArray(data))) {
        return false;
    }
    if (isArr) {
        return data.findIndex((i: any) => isEqual(i, value)) > -1;
    }
    for (const key in data) {
        if (isEqual(data[key], value)) {
            return true;
        }
    }
    return false;
};

export const isHaveString = (arr: any, str?: any) => {
    str = str as String;
    return isArray(arr) && arr.some((i: any) => str.includes(String(i)));
};

export const isHaveProp = (obj: any, prop: string) => obj.hasOwnProperty(prop);

export const isHaveProps = (obj: any, propTxts: string) => propTxts.split(' ').every((i) => obj.hasOwnProperty(i));

export const isObjectId = (id?: string) => (id || '').match(/^[0-9a-fA-F]{24}$/);

export const isUrl = (str: any, type?: string): boolean => {
    let regex;
    switch (type) {
        case 'facebook':
            regex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/.(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-\.]*)/;
            break;
        case '':
        default:
            // regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/; // OLD regex
            regex = new RegExp(
                '^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$',
                'i',
            ); // fragment locator
            break;
    }
    return !!regex.test(str);
};

export const isFileUrl = (url: string): boolean => {
    let params: any[] = url.split('/');
    if (params.length > 3) {
        let fileName = params.pop();
        return !['?', '#'].includes(fileName[0]) && fileName.includes('.');
    }
    return false;
};

export const isLocalhostUrl = (url: string): boolean => url.split(/[/:]/)?.[3]?.split('.')?.pop() === 'localhost';

export const isJSON = (data: any): boolean => {
    try {
        if (isObject(data) || isArray(data)) return true;
        if (!data) return false;
        if (isString(data)) {
            JSON.parse(data);
        } else {
            JSON.parse(JSON.stringify(data));
        }
    } catch {
        return false;
    }
    return true;
};

export const toJSON = (data: any): any => {
    try {
        if (isObject(data) || isArray(data)) return data;
        let json = null;
        if (isString(data)) {
            json = JSON.parse(data);
            if (isString(json)) {
                json = JSON.parse(json ?? '');
            }
        } else {
            json = JSON.parse(JSON.stringify(data));
        }
        return json;
    } catch {
        return null;
    }
};

export const isFunction = (value: any): boolean => typeof value === 'function';

export const isEqual = (arg1: any, arg2: any) => fastCompare(arg1, arg2);

export const isEmoji = (str: any): boolean =>
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/.test(
        str,
    );

export const removeViChar = (str?: string, noLowerCase?: boolean): string => {
    if (!str) return '';
    str = String(str);
    if (noLowerCase) {
        str = str
            .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
            .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
            .replace(/[ÌÍỊỈĨ]/g, 'I')
            .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
            .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
            .replace(/[ỲÝỴỶỸ]/g, 'Y')
            .replace(/Đ/g, 'D');
    } else str = str.toLowerCase();
    return str
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd');
};

export const isObjectIncludes = (object: any, keyword: string, props: any): boolean =>
    props.some((i: any) => removeViChar(object[i] || '').includes(keyword));

type UtilRemoveUnicodeOptions = {
    type?: string;
    middle?: string;
};

export const removeUnicode = (str: string, options?: UtilRemoveUnicodeOptions) => {
    const { type, middle } = options || {};
    if (!str || !isString(str)) {
        return '';
    }
    str = removeViChar(str);
    if (type === 'email') {
        str = str.replace(/[^_@.a-z0-9]/g, '-');
    } else {
        str = str
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-/g, middle || ' ') // replace - to \s
            .replace(/^\-+|\-+$/g, '');
    }
    return str.replace(/-+-/g, '-');
};

export const removeSpecialChar = (str: string) =>
    str.replace(
        /[^a-zA-Z0-9\sÀÁẠÃẢÂẦẤẬẪẨĂẰẮẶẴẲĐÈÉẸẼẺÊỀẾỆỄỂÌÍỊĨỈÒÓỌÕỎÔỒỐỘỖỔƠỜỚỢỠỞÙÚỤŨỦƯỪỨỰỮỬàáạãảâầấậẫẩăằắặẵẳđèéẹẽẻêềếệễểìíịĩỉòóọõỏôồốộỗổơờớợỡởùúụũủưừứựữử]/g,
        '',
    );

export const randomString = (input: string, strLength?: number): string => {
    let str =
        {
            num: '0123456789',
            char: 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
            mix: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz',
            charLow: 'abcdefghiklmnopqrstuvwxyz',
            charUp: 'ABCDEFGHIJKLMNOPQRSTUVWXTZ',
            numLow: '0123456789abcdefghiklmnopqrstuvwxyz',
            numUp: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ',
        }[input] ??
        input ??
        '';
    let length = strLength ?? str.length;
    return Array.from({ length })
        .map(() => {
            let rnum = Math.floor(Math.random() * str.length);
            return str.substring(rnum, rnum + 1);
        })
        .join('');
};

export const reverseStr = (str: any): string => String(str).split('').reverse().join('');

export const randomValue = (inputValue?: any, isInt?: boolean): any => {
    if (!inputValue || !isString(inputValue)) return null;
    let rnum = Math.floor(Math.random() * inputValue.length),
        rvalue = inputValue.substring(rnum, rnum + 1);
    return isInt ? parseInt(rvalue) : rvalue;
};

export const calcCrowDistance = (lat1: number, lon1: number, lat2: number, lon2: number, unit?: string): number => {
    let R = 6371 * (unit === 'm' ? 1000 : 1); // default km;
    let dLat = ((lat2 - lat1) * Math.PI) / 180;
    let dLon = ((lon2 - lon1) * Math.PI) / 180;
    let dlat1 = (lat1 * Math.PI) / 180;
    let dlat2 = (lat2 * Math.PI) / 180;
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(dlat1) * Math.cos(dlat2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export const cloneObj = (obj: any, props?: string, isRemove?: boolean): any => {
    let _obj: any = {},
        _props = String(props || '').split(' ');
    if (obj && _props.length) {
        obj = cloneDeep(obj);
        if (isRemove) {
            Object.keys(obj).forEach((key) => {
                if (!_props.includes(key)) {
                    _obj[key] = obj[key];
                }
            });
        } else {
            _props.forEach((i) => (_obj[i] = obj[i]));
        }
    }
    return _obj;
};

export const json2String = (json: any): string => JSON.stringify(json).replace(/"/g, `'`);

export const string2Json = (txt: string): any => {
    try {
        if (!txt || !isString(txt)) return null;
        return JSON.parse(txt.replace(/'/g, '"'));
    } catch (error) {
        return null;
    }
};

export const indexText = (index: number, max: number, isSkipZero?: boolean): string => {
    let indexTxt = isSkipZero ? String(index + 1) : String(index),
        maxTxt = String(max),
        indexL = indexTxt.length,
        maxL = maxTxt.length,
        subTxt = '';
    if (maxL > indexL) {
        for (let i = 0; i < maxL - indexL; i++) {
            subTxt += '0';
        }
    }
    return subTxt + indexTxt;
};

export const miniTimer = (time: number): Promise<any> =>
    new Promise((resolve: any) => (isNumber(time) ? setTimeout(resolve, time) : resolve()));

export const getProps = (data: any, field: string, isConcatArray?: boolean, isUnique?: boolean) => {
    if (!isArray(data) || data.length == 0 || !field) {
        return [];
    }
    let props: any[] = [];
    data.forEach((item: any) => {
        if (isConcatArray) {
            props = props.concat(item[field]);
        } else {
            props.push(item[field]);
        }
    });
    if (isUnique) {
        props = _uniq(props);
    }
    return props;
};

export const getSmsAmount = (smsTxt: any): number => {
    if (!smsTxt || !isString(smsTxt)) {
        return 0;
    }
    let textSize = smsTxt.length;
    if (textSize <= 160) {
        return 1;
    }
    if (textSize % 155 === 0) {
        return textSize / 155;
    }
    return (textSize - (textSize % 155)) / 155 + 1;
};

export const removeProps = (obj: any, propTxt?: string): any => {
    if (!obj) return null;
    if (!propTxt || !isString(propTxt)) {
        return obj;
    }
    let props = propTxt.split(' ');
    if (props.length === 0) {
        return obj;
    }
    let newObj = _cloneDeep(obj);
    props.forEach((prop) => delete newObj[prop]);
    return newObj;
};

export const uniqArray = (arr: any) => (isArray(arr) ? _uniq(arr) : arr);

export const formatBytes = (a: number, b?: number, space?: boolean): string => {
    if (0 == a) return '0 Bytes';
    let c = 1024,
        d = b || 2,
        e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + (space ? ' ' : '') + e[f];
};

export const roundNumber = (type?: string, number?: any) => {
    if (!type || !isNumber(number)) return null;
    let roundedNumber = 0;
    switch (type) {
        case 'f':
            roundedNumber = Math.round(parseFloat(number));
            break;
        case 'i':
            roundedNumber = parseInt(number);
            let divided = roundedNumber / 10,
                surplus = String(divided).split('.');
            if (surplus.length > 1) {
                roundedNumber = parseInt(surplus[0]) * 10 + 10;
            }
            break;
        default:
            break;
    }
    return roundedNumber;
};

export const getDateTxt = (date: any, isFormat: boolean = true): string => `${isFormat && date < 10 ? '0' : ''}${date}`;

type UtilGetMediaTimerOptions = {
    middle?: string;
    hUnit?: string;
    minUnit?: string;
    secUnit?: string;
    minStr?: boolean;
    hDefault?: boolean;
};

export const getMediaTimer = (t: any, options?: UtilGetMediaTimerOptions): string => {
    const { middle = ':', hUnit, minUnit, secUnit, minStr, hDefault } = options ?? {};
    t = parseInt(isUndefined(t) ? 0 : t);
    if (!t) return `00${middle}00`;
    let isH = t > 3600,
        h = isH ? Math.trunc(t / 3600) : 0,
        min = Math.trunc((isH ? t % 3600 : t) / 60),
        sec = Math.trunc((isH ? t % 3600 : t) % 60),
        hTxt = h ? `${getDateTxt(h, !minStr)}${hUnit ?? ''}${middle}` : hDefault ? `00${middle}` : '',
        minTxt = `${getDateTxt(min, !minStr)}${minUnit ?? ''}${middle}`,
        secTxt = `${getDateTxt(sec, !minStr)}${secUnit ?? ''}`;
    return `${hTxt}${(minStr && min > 0) || !minStr ? minTxt : ''}${secTxt}`;
};

export const getPagingData = (datas: any, page?: any, size?: any): any => {
    if (!isArray(datas) || isUndefined(page) || isUndefined(size) || !isNumber(page) || !isNumber(size)) {
        return [];
    }
    let from = page * size;
    return datas.slice(from, from + size);
};

export const shuffleString = (str?: string) => {
    let a = (str ?? '').split(''),
        n = a.length;
    for (let i = n - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join('');
};

export const genUuid = (version = '1', options?: any): string => {
    let custom_namespace;
    version = String(version);
    if (version === '3' || version === '5') {
        if (!isArray(options, true)) {
            return '';
        }
        switch (options[1]) {
            case 'DNS':
                custom_namespace = uuidv5.DNS;
                break;
            case 'URL':
                custom_namespace = uuidv5.URL;
                break;
            default:
                custom_namespace = options[1];
                break;
        }
    }
    switch (version) {
        case '0':
            return shuffleString(randomString('char', 11) + +new Date());
        case '1': // timestamp => '2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d';
            return uuidv1();
        case '3': // namespace
            // using predefined DNS namespace (for domain names) => '9125a8dc-52ee-365b-a5aa-81b0b3681cf6';
            // using predefined URL namespace (for, well, URLs) => 'c6235813-3ba4-3801-ae84-e0a6ebb7d138';
            // using a custom namespace;
            // => Note: Custom namespaces should be a UUID string specific to your application!
            // => E.g. the one here was generated using this modules `uuid` CLI.
            // => const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
            // => 'e8b5a51d-11c8-3310-a6ab-367563f20686';
            return uuidv3(options?.[0], custom_namespace);
        case '4':
            return uuidv4(); // random => '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed';
        case '5':
            return uuidv5(options?.[0], custom_namespace); // namespace, same input type as v3;
        default:
            return '';
    }
};

export const cloneDeep = <T = any>(obj: any): T => (obj ? _cloneDeep(obj) : obj);

export const timerFunc = (timeout: any, cb: Function) => {
    let _timeout: any = String(timeout).trim();
    if (_timeout) {
        let sortType: any = [
            ['s', 1],
            ['m', 60],
            ['h', 3600],
            ['d', 86400],
        ].find((i) => i[0] === _timeout.slice(-1));
        _timeout = parseFloat(_timeout);
        if (isArray(sortType, true)) {
            _timeout *= sortType[1] * 1000;
        }
        _timeout = parseInt(String(_timeout));
    }
    _timeout ? setTimeout(cb, _timeout) : cb();
};

export const randomIntFromInterval = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1) + min); // min and max included

export const filterArray = (keysearch?: string, propKeyTxt?: string, arr?: any[], arrTxt?: string): any[] => {
    if (!keysearch || !propKeyTxt || !isArray(arr, true)) {
        return [];
    }
    let result: any[] = [],
        searchReg = getEscapesRegex(removeViChar(keysearch), 'i');
    let propSearchs = String(propKeyTxt).split(' ');
    propSearchs.forEach((prop: any) => {
        let searchData =
            arr?.filter((item, index) => {
                let value = removeViChar((arrTxt && arrTxt[prop] && arrTxt[prop][index]) || item[prop]);
                return searchReg.test(value) || value.indexOf(keysearch) > -1;
            }) ?? [];
        result = _uniq([...result, ...searchData]);
    });
    return result;
};

type UtilIsValidPhoneOptions = {
    max?: number;
    min?: number;
    isSpec?: boolean;
    skipPrefix?: boolean;
};

export const isValidPhone = (phone: any, options?: UtilIsValidPhoneOptions): boolean => {
    const { max, min, isSpec, skipPrefix } = options ?? {};
    phone = String(phone);
    const prefix = !skipPrefix
        ? ['855', '84', '0'].some((i) => phone.startsWith(i)) ||
          (isSpec && ['1900', '1800'].some((i) => phone.startsWith(i)))
        : true;
    return !!(phone.length >= (min ?? 8) && phone.length <= (max ?? 12) && prefix);
};

export const isOdd = (number: number): boolean => !!(number % 2);

export const compareJson = (obj1: any, obj2: any) => {
    try {
        return JSON.stringify(obj1).split('"').sort().join('') === JSON.stringify(obj2).split('"').sort().join('');
    } catch (error) {
        return obj1 === obj2;
    }
};

export const extractHostname = (url = '') => {
    url = String(url);
    if (!url) return '';
    return url.replace(/(https|http)+:|\/\//g, '').split(/\/\/|\/|\?|#|:/g)[0];
};

export const uniqBy = <T>(list: T[], key: string): T[] => _uniqBy(list, key);

type UtilLoadScriptOptions = {
    id?: string;
};

export const loadScript = (src: any, options?: UtilLoadScriptOptions, onLoad = () => null) => {
    const { id } = options ?? {};
    let s, t;
    s = document.createElement('script');
    if (id) s.id = id;
    s.src = src;
    s.type = 'text/javascript';
    s.onload = onLoad;
    t = document.getElementsByTagName('script')[0];
    t.parentNode?.insertBefore(s, t);
};

export const triggerEvent = (el: any, event: any, fn?: Function, isRemove?: boolean) => {
    let listEvent = isArray(event) ? event : [event];
    if (!el) {
        console.log('missing triggerEvent el:', el, event);
        return;
    }
    listEvent.forEach((e: any) => {
        el[`${isRemove ? 'remove' : 'add'}EventListener`](e, fn, false);
    });
};

export const addEvent = (el: any, event: any, fn?: Function, opts?: any): void => {
    let _el = el.current || el;
    let listEvent = isArray(event) ? event : [event];
    if (!_el) {
        console.log('missing addEvent el:', _el, event);
        return;
    }
    let isOld = !_el.addEventListener,
        addMethod = isOld ? 'attachEvent' : 'addEventListener';
    listEvent.forEach((e: any) => {
        let eventArgs = [`${isOld ? 'on' : ''}${e}`, fn, opts];
        !isOld && eventArgs.push(false);
        _el[addMethod](...eventArgs);
    });
};

export const scrollHorizontally = (el: any, e: any, step?: number): void => {
    let _el = el.current || el;
    if (!_el) return;
    let delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
    _el.scrollLeft -= delta * (step || 40);
    // e.preventDefault();
};

export const getEscapesRegex = (keyword: string, options: any) =>
    new RegExp(keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), options);

export const reorderArray = <T>(list: T[], oldIdx: number, newIdx: number): T[] => {
    const result = Array.from(list);
    const [removed] = result.splice(oldIdx, 1);
    result.splice(newIdx, 0, removed);
    return result;
};

export const swapArrayItem = <T>(list: T[], oldIdx: number, newIdx: number): T[] => {
    const oldItem = list[oldIdx],
        newItem = list[newIdx];
    list[oldIdx] = newItem;
    list[newIdx] = oldItem;
    return list;
};

export const parseCookies = () =>
    Object.fromEntries(
        document.cookie.split('; ').map((i) => {
            let index = i.indexOf('='),
                key = i.substring(0, index),
                value = decodeURIComponent(i.substring(index + 1)),
                _value = value;
            try {
                _value = JSON.parse(value);
            } catch {
                _value = value;
            }
            return [key, _value];
        }),
    );

export const strObj2Json = (str: any): any => {
    try {
        return JSON.parse(
            str
                .split('{')
                .map((i: any) => (i && !i.startsWith('[') ? `"${i}` : i))
                .join('{')
                .split(':')
                .map((i: any) =>
                    ['null', 'true', 'false', '"', '}', ']', 'https'].some((j) => i.endsWith(j)) ? i : i + '"',
                )
                .join(':')
                .split(',')
                .map((i: any) => {
                    let _i = i;
                    if (!['{', '[', '"'].some((j) => i.startsWith(j))) _i = '"' + _i;
                    if (!['null', 'true', 'false', '"', '}', ']'].some((j) => i.endsWith(j))) _i += '"';
                    return _i;
                })
                .join(','),
        );
    } catch {
        return null;
    }
};

export const removeHtmlTags = (str: any): string => {
    if (!str) return '';
    return String(str)
        .replace(/<br>|\n|&nbsp;/g, ' ')
        .replace(/\s\s+/g, ' ')
        .replace(/(<([^>]+)>)/gi, '')
        .trim();
};

export const random10Str = (): string => randomString('mix', 10);

export const fakeArray = (length: number = 0) => Array.from({ length }).map(() => randomString('mix', 3));

export const isPathSvg = (path: string) => (path || '').endsWith('.svg');

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

export const replaceWhitespaceImg = (url: string) => {
    return url.replace(/\s/g, '%20');
};

export const getRouterQuery = ({ multi, decode, noDynamic, query }: any = {}) => ({
    ...Object.fromEntries(
        query
            .substring(1)
            .split('&')
            .map((param: any) => {
                let parts = param.split('=');
                parts[0] = decodeURIComp(parts[0]);
                if (multi) {
                    parts[1] = parts?.[1]?.split(',').map((i: any) => (decode ? decodeURIComp(i) : i));
                } else {
                    parts[1] = decode ? decodeURIComp(parts[1]) : parts[1];
                }
                return parts;
            })
            .filter((i: any) => i[0]),
    ),
});

export const isTextMultiLine = (
    text: string,
    {
        fontSize = 16,
        padding = '0 32px',
        width = '',
        fontWeight,
        lineHeight = 'normal',
        line = 1,
    }: {
        fontSize?: number;
        padding?: string;
        width?: string;
        fontWeight?: number;
        line?: number;
        lineHeight?: string;
    } = {},
) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.visibility = 'hidden';
    tempDiv.style.width = width || `clac(100vw - ${fontSize}px)`;
    tempDiv.style.whiteSpace = 'normal';
    tempDiv.style.height = 'auto';
    tempDiv.style.padding = padding;
    tempDiv.style.border = 'none';
    tempDiv.style.margin = '0';
    tempDiv.style.lineHeight = lineHeight ?? 'normal';
    tempDiv.style.fontSize = fontSize + 'px';
    if (fontWeight) tempDiv.style.fontWeight = fontWeight.toString();
    tempDiv.innerText = text;
    document.body.appendChild(tempDiv);

    const initialHeight = tempDiv.clientHeight;

    tempDiv.style.whiteSpace = 'nowrap';
    const singleLineHeight = tempDiv.clientHeight * line;

    document.body.removeChild(tempDiv);

    return initialHeight > singleLineHeight;
};

export const parseObjToCamel = (objs: any, option?: { t?: string; ignoreId?: boolean; isDeep?: boolean }) => {
    const { t = 'c', ignoreId = true, isDeep } = option || {};
    if (!isObject(objs, true)) return objs || {};
    const parseObj = (obj: any) =>
        Object.entries(cloneDeep(obj)).reduce((result, [id, value]) => {
            const key = id === '_id' && ignoreId ? id : toCaseStyle(t, id);
            let datas: any = value;
            if (isDeep) {
                if (isArray(datas)) {
                    datas = datas.map((i: any) => (isObject(i) ? parseObj(i) : i));
                } else if (isObject(value, true)) {
                    datas = parseObj(value);
                }
            }
            return {
                ...result,
                [key]: datas,
            };
        }, {});
    return parseObj(objs);
};

export const parserOptionToKey = (arr: any) =>
    arr.reduce((acc: any, item: any) => ({ ...acc, [item.value]: item }), {});

type TGetUrlBank = {
    code?: string;
    number?: string;
    amount?: string;
    content?: string;
    ownerName?: string;
};

export const getImageUrlBank = (datas: TGetUrlBank) => {
    if (!datas) return '';

    const { code = '', number = '', amount = '', content = '', ownerName = '' } = datas;
    return `${domains.imageVi}image/${code}-${number}-qr_only.png?amount=${amount}&addInfo=${content}&accountName=${ownerName}`;
};
