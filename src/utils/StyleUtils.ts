import { isArray, isFunction } from './Utils';
import { colors, theme } from '@/styles/theme';

export type UtilGetSvgStyleOption = {
    color?: string;
    style?: object;
    customKey?: string;
    selector?: string;
};

export const getSvgStyle = (option: UtilGetSvgStyleOption | Function, callback?: Function) => {
    const isFunc = isFunction(option);
    const { color, style, customKey, selector } = (option && !isFunc ? option : {}) as UtilGetSvgStyleOption;
    const _selector = selector ?? (!customKey ? '& svg g' : `& path[fill="${colors.primary}"]`);
    const cb = (isFunc ? option : callback) as Function;
    return cb ? cb(_selector) : { [_selector]: { fill: color, ...style } };
};

export const rgbaStringToHex = (rgbaString: any) => {
    if (!rgbaString) return '';
    let matches = rgbaString.match(/(\d+)/g);
    let r = parseInt(matches[0]);
    let g = parseInt(matches[1]);
    let b = parseInt(matches[2]);

    let hex = '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');

    return hex;
};

export const isRgba = (rgba: any) => {
    const rgbaPattern = /^rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*(\d*\.?\d+)?\)$/;
    return rgbaPattern.test(rgba);
};

export const getColor = (...args: any[]) => {
    let id = args[0],
        opacity = args[1] || 'main';
    if (isArray(args[0])) {
        id = args[0][0];
        opacity = args[0][1] || 'main';
    }
    return theme?.palette?.[id]?.[opacity] || colors[id] || id;
};

export const validateColor = (color?: string) => (color && (color.match(/#+\w{3,6}/g) || [])[0]) || '';

const muAlpha = (hex: string, opacity: number) => {
    const match = hex.replace('#', '').match(/.{1,2}/g);
    if (!match) return hex;

    const [r, g, b] = match.map((x) => parseInt(x, 16));

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const toRgbA = (color?: string, opacity: number = 1, isImportant?: boolean) => {
    let _color = getColor(color) || color || '';
    if (isLinear(_color)) _color = linear2Hex(_color);
    _color = validateColor(_color);
    let rgba = _color ? muAlpha(_color, opacity) : _color;
    if (isImportant) rgba += ' !important';
    return rgba;
};

export const isLinear = (color?: string) => String(color ?? '').startsWith('linear');

export const linear2Hex = (color: string) => {
    let _color = color;
    if (isLinear(_color)) {
        _color = `#${_color.split(/#/).map((i) => i.replace(/[^\w\s]/gi, '').trim())[1]}`;
    }
    return _color;
};
