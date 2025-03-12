import { isFunction } from "./Utils";
import { colors } from "@/styles/theme";

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