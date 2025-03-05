import numeral from 'numeral';
import { isCharacter, isEmail, isNumeric, isUrl, removeUnicode, removeViChar, isArray } from './Utils';

export const replaceAllStr = (str: any, search: any, rep?: any) => {
    // new RegExp('[^0-9\,]', 'g') = /[^0-9\,]/g => remove all non-numeric, except char ",";
    // /[^A-Za-z0-9]/ => remove all non-alphanumeric
    return !str || !search ? '' : String(str).replace(new RegExp(search, 'g'), rep || '');
};

export const getLastName = (fullName: any, firstChar?: any, noNumberChar: string = '') => {
    fullName = String(fullName);
    if (!fullName) return noNumberChar;
    switch (true) {
        case isEmail(fullName):
            fullName = fullName.split('@')[0];
            break;
        case !!firstChar:
            fullName = removeUnicode(fullName);
            break;
        default:
            break;
    }
    let lastName = '';
    if (fullName) {
        let nameParts = fullName.split(' ').reverse();
        lastName = nameParts.find((i: any) => isCharacter(i)) || nameParts[0];
    }
    if (firstChar && lastName) {
        firstChar = (lastName.split('').find((i) => isCharacter(i)) ?? lastName[0]).toUpperCase();
        return noNumberChar && !isCharacter(firstChar) ? noNumberChar : firstChar;
    }
    return lastName || noNumberChar;
};

export const capitalizeStr = (str: any, all?: any) => {
    str = String(str || '').trim();
    if (!str) return '';
    let capitalize = (text: string) => text[0].toUpperCase() + text.slice(1);
    return all ? str.split(' ').map(capitalize).join(' ') : capitalize(str);
};

export const textTransform = (type: any, str = '') => {
    str = String(str || '');
    switch (type) {
        case 'lf':
            return str[0].toLowerCase() + str.substring(1);
        case 'l':
            return str.toLowerCase();
        case 'u':
            return str.toUpperCase();
        case 'c':
            return capitalizeStr(str);
        case 'ca':
            return capitalizeStr(str, true);
        default:
            return str;
    }
};

export type UtilTrimStrOptions = {
    type?: string;
    full?: boolean;
    validate?: boolean;
};

export const trimStr = (str: any, { type, full, validate }: UtilTrimStrOptions = {}) => {
    if (!str) return '';
    str = String(str).trim(); // trim text;
    str = str.replace(full ? / /g : /\s\s+/g, full ? '' : ' '); // full ? replace all space to none : replace 2 space to 1 space;
    str = textTransform(type, str);
    return validate ? !!str : str;
};

export const securityText = (str: any, target?: string, lengthSecuty?: number) => {
    if (!str) return '';
    let _lengthSecuty = lengthSecuty ?? 3;

    let first = str.slice(0, _lengthSecuty);
    let last = str.slice(_lengthSecuty);

    return (
        first +
        (last
            ? String(last)
                  .split('')
                  .map(() => target ?? '*')
                  .join('')
            : '')
    );
};

export const isLowerCase = (str: string) => {
    return str == str.toLowerCase() && str != str.toUpperCase();
};

export const toCaseStyle = (toCase: string, variable: string) => {
    // camel, pascal, snake, kebab;
    if (!variable) return '';
    let strs: string[] = [],
        splitSingleStr = (input: string) => {
            let strTemp = '';
            [...input.split(''), ''].forEach((char, idx) => {
                let isLowerChar = isLowerCase(char),
                    isNumber = isNumeric(char);
                if (idx !== 0 && !isLowerChar && !isNumber) {
                    strs.push(strTemp);
                    strTemp = '';
                }
                strTemp += char;
            });
        };
    switch (true) {
        case variable.indexOf('_') > -1:
            variable.split('_').forEach(splitSingleStr);
            break;
        case variable.indexOf('-') > -1:
            variable.split('-').forEach(splitSingleStr);
            break;
        default:
            splitSingleStr(variable);
            break;
    }
    switch (toCase) {
        case 'c': // camel
            return strs.map((str, idx) => textTransform(idx === 0 ? 'l' : 'c', str)).join('');
        case 'p': // pascal
            return strs.map((str) => textTransform('c', str)).join('');
        case 's':
        case 'su': // snake
            return strs.map((str) => textTransform(toCase === 's' ? 'l' : 'u', str)).join('_');
        case 'k': // kebab
            return strs.map((str) => textTransform('l', str)).join('-');
        default:
            return '';
    }
};

const escapeHtmlMapping: any = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
};
export const escapeHtml = (str: any) => {
    if (!str) return '';
    return str.replace(/[&<>"'`=/]/g, (s: string) => escapeHtmlMapping[s]);
};

export const unescapeHtml = (htmlText?: any) => {
    if (!htmlText) return '';
    htmlText = String(htmlText)
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x2F;/g, '/')
        .replace(/&apos;/g, "'")
        .replace(/&#x3D;/g, '=')
        .replace(/<!DOCTYPE/g, '&lt;!DOCTYPE')
        .replace(/<html/g, '&lt;html')
        .replace(/\/html/g, '&#x2F;html')
        .replace(/<head/g, '&lt;head')
        .replace(/\/head/g, '&#x2F;head')
        .replace(/<body/g, '&lt;body')
        .replace(/\/body/g, '&#x2F;body')
        .replace(/<footer/g, '&lt;footer')
        .replace(/\/footer/g, '&#x2F;footer')
        .replace(/<link/g, '&lt;link')
        .replace(/\/link/g, '&#x2F;link')
        .replace(/<title/g, '&lt;title')
        .replace(/\/title/g, '&#x2F;title')
        .replace(/<meta/g, '&lt;meta')
        .replace(/\/meta/g, '&#x2F;meta')
        .replace(/<script/g, '&lt;script')
        .replace(/\/script/g, '&#x2F;script');
    let blackListAttrs = ['id', 'class'];
    let div = document.createElement('div');
    div.innerHTML = htmlText;
    div.querySelectorAll('*').forEach((node: any) => {
        switch (node.tagName) {
            case 'IFRAME':
                node.src = '';
                break;
            case 'NOSCRIPT':
                node.innerHTML = '';
                break;
            default:
                break;
        }
        for (let attribute of node.attributes) {
            let { name, value } = attribute;
            if (node.hasAttribute(name)) {
                if (name.startsWith('on')) attribute.value = '';
                if (name === 'href' && !isUrl(value)) attribute.value = encodeURI(value);
                if (blackListAttrs.includes(name)) {
                    blackListAttrs.forEach((removeName) => node.removeAttribute(removeName));
                }
            }
        }
    });
    let result = div.innerHTML;
    div.remove();
    return result;
};

export type UtilDetectLinkOption = {
    decode?: boolean;
    getLink?: boolean;
    escape?: boolean;
    formater?: Function;
};

export const strReplaceAt = (str: any, index: number, replacement: string) => {
    let _str = String(str);
    if (index >= _str.length) return _str.valueOf();
    return _str.substring(0, index) + replacement + _str.substring(index + 1);
};

const string2GroupArray = (str: string): any[] => {
    let arrs = str.split('');
    let result: any = [];
    arrs.forEach((t, i) => {
        let _t = arrs.slice(i).join('');
        if (_t.length >= 3) result.push(_t.substring(0, 3));
    });
    return result;
};
export const validatePassword = (_pass: string): any => {
    if (!trimStr(_pass, { full: true })) return false;
    let pass = textTransform('l', _pass);

    let errField: any = {};

    let adjacentChar = ['0123456789', '9876543210', 'abcdefghiklmnopqrstuvwxyz', 'zyxwvutsrqponmlkihgfedcba'];
    let groupStr = string2GroupArray(pass);
    for (let t of groupStr) {
        let _t = adjacentChar.find((i) => i.includes(t));
        if (_t) {
            errField.adjacentChar = t;
            break;
        }
    }

    return errField;
};

export const formatNumber = (number: any, format?: string) => {
    // Numbers
    // 10000            '0,0.0000'          10,000.0000
    // 10000.23         '0,0'               10,000
    // 10000.23         '+0,0'              +10,000
    // -10000           '0,0.0'             -10,000.0
    // 10000.1234       '0.000'             10000.123
    // 100.1234         '00000'             00100
    // 1000.1234        '000000,0'          001,000
    // 10               '000.00'            010.00
    // 10000.1234       '0[.]00000'         10000.12340
    // -10000           '(0,0.0000)'        (10,000.0000)
    // -0.23            '.00'               -.23
    // -0.23            '(.00)'             (.23)
    // 0.23             '0.00000'           0.23000
    // 0.23             '0.0[0000]'         0.23
    // 1230974          '0.0a'              1.2m
    // 1460             '0 a'               1 k
    // -104000          '0a'                -104k
    // 1                '0o'                1st
    // 100              '0o'                100th

    // Currency
    // 1000.234         '$0,0.00'           $1,000.23
    // 1000.2           '0,0[.]00 $'        1,000.20 $
    // 1001             '$ 0,0[.]00'        $ 1,001
    // -1000.234        '($0,0)'            ($1,000)
    // -1000.234        '$0.00'             -$1000.23
    // 1230974          '($ 0.00 a)'        $ 1.23 m

    // Bytes
    // 100              '0b'                100B
    // 1024             '0b'                1KB
    // 2048             '0 ib'              2 KiB
    // 3072             '0.0 b'             3.1 KB
    // 7884486213       '0.00b'             7.88GB
    // 3467479682787    '0.000 ib'          3.154 TiB

    // Percentages
    // 1                '0%'                100%
    // 0.974878234      '0.000%'            97.488%
    // -0.43            '0 %'               -43 %
    // 0.43             '(0.000 %)'         43.000 %

    // Time
    // 25               '00:00:00'          0:00:25
    // 238              '00:00:00'          0:03:58
    // 63846            '00:00:00'          17:44:06

    // Exponential
    // 1123456789       '0,0e+0'            1e+9
    // 12398734.202     '0.00e+0'           1.24e+7
    // 0.000123987      '0.000e+0'          1.240e-4

    try {
        let formated = '',
            isNegative = number < 0,
            _number = String(number),
            _format = format && format !== '0.0' ? format : '0,0';
        if (_format === '0,0' && _number.includes('e+')) {
            _number = String(BigInt(number)).replace('-', '');
            let index = _number.length % 3;
            if (index > 0) formated += _number.substring(0, index) + ',';
            formated += (_number.substring(index).match(/\d{1,3}/g) ?? []).join(',');
            if (isNegative && !formated.startsWith('-')) formated = '-' + formated;
        } else {
            formated = numeral(number).format(_format);
        }
        if (isNegative && !formated.startsWith('-')) formated = '-' + formated;
        if (format === '0.0') return replaceAllStr(formated, ',', '.');
        return formated;
    } catch (error) {
        return number;
    }
};

export const currencyConverterByCountry = (value?: any, options: any = {}) => {
    const { currency_unit = '', excess, noUnit, noSpaceUnit } = options;
    let currencyUnit = textTransform('u', currency_unit);
    if (!value) return 0 + (noUnit ? '' : ' ' + currencyUnit);
    let checkExcess = false,
        unit: any = '',
        format = '0,0',
        length = 0;
    if (String(value).includes('.')) {
        unit = String(value).split('.')[1];
        length = unit.length > 4 ? 4 : unit.length;
        checkExcess = unit > 0;
    }
    if (excess || (currencyUnit && currencyUnit !== 'VND' && checkExcess)) {
        const tails = ['0', '0', '00', '000', '0000'];
        format = `0,0.${tails[length]}`;
        value = parseFloat(value).toFixed(length);
    }
    let result = formatNumber(value, format);
    if (!noUnit) {
        if (!noSpaceUnit) result += ' ';
        result += currencyUnit;
    }
    return result;
};
export const getHTMLAttributes = (attrs: any, valueWrapper = '"') =>
    Object.entries(attrs)
        .map(([key, value]) => `${key}=${valueWrapper}${value}${valueWrapper}`)
        .join(' ');

export const getValidString = (str: any, regex: any): string => {
    switch (regex) {
        case '[0-9]':
            return str.replace(/\D/gi, '');
        case 'email':
            return removeViChar(str).replace(/[^\w\d@\-_.]/gi, '');
        case 'fieldCode':
            return removeViChar(str).replace(/[^\w\d\-_]/gi, '');
        case 'field_code':
            return removeViChar(replaceAllStr(str, ' ', '_').replace(/_+/g, '_')).replace(/[^\w\d_]/gi, '');
        case 'FIELD_CODE':
            return textTransform(
                'u',
                removeViChar(replaceAllStr(str, ' ', '_').replace(/_+/g, '_')).replace(/[^\w\d_]/gi, ''),
            );
        default:
            return str;
    }
};

export const converStringToSlug = (text: string, keyConnect: string = '_') =>
    text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-')
        .replace(/-+/g, keyConnect || '_')
        .replace(/^-+|-+$/g, '');

export const checkContentEditable = (e: any, onEnter?: boolean) => {
    if (!['Delete', 'Backspace'].includes(e.code) && e.target?.innerText?.length > 256) {
        e.preventDefault();
        return false;
    }
    if (onEnter && e.code === 'Enter') {
        e.preventDefault();
        return true;
    }
};

export const cleanSpaceNote = (t: string) => (t === '\n' || t === '<br />' ? '' : t);

export const extractQueryParam = (location: any) => {
    if (!location) return {};
    const params: any = new URLSearchParams(location.search);
    return Object.fromEntries(params);
};

export const updateURLParameter = (url: string, paramName: string, paramValue: any) => {
    let regex = new RegExp('([?&]' + paramName + '=)[^&]*');
    if (url.match(regex)) {
        return url.replace(regex, '$1' + paramValue);
    } else {
        let separator = url.indexOf('?') !== -1 ? '&' : '?';
        return url + separator + paramName + '=' + paramValue;
    }
};

export const genStringMappingVar = (temp: string, datas: any) => {
    let template: string = temp || '';

    const vars: any[] =
        template
            .match(new RegExp(/{{[^`~!@#$%^&*+=\\\[\]\{\};':\/<>\?]+}}/, 'gi'))
            ?.map((i: string) => i.replace('{{', '').replace('}}', '')) || [];
    if (isArray(vars, true)) {
        const getData = (datas: any, key: string): any => {
            let _data = datas?.[key];
            if (key?.includes('.')) {
                const [parentKey, ...childs] = key.split('.');
                const childKey: string = childs.join('.');
                _data = getData(datas?.[parentKey] || {}, childKey);
            }
            return _data;
        };
        vars.forEach((key: string) => {
            template = template.replace(`{{${key}}}`, getData(datas, key) || '');
        });
    }

    return template;
};

export const convertFormattedStringToNumber = (formattedString: any) => {
    if (!formattedString) return formattedString;
    const numberString = (formattedString || 0).toString().replace(/,/g, '');
    return Number(numberString);
};

export const urlify = (text: string): string => {
    if (!text) return text;

    let urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        let str = url.slice(0, 52) + '...';
        return `<span class="text-info" data-url="${url}">` + str + '</span>';
    });
};

export const formatLargeNumberWithCommas = (numberString: string): string => {
    if (!/^\d+$/.test(numberString)) return numberString;

    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
