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
