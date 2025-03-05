import { isNumber, isNumeric } from './Utils';
import { format as dateFnsFormat } from 'date-fns';

const timeUnits = {
    y: 'year',
    m: 'month',
    w: 'week',
    d: 'day',
    h: 'hour',
    min: 'minute',
};

export const isDate = (d: any) => {
    if (!d) return false;
    if (!isNumeric(parseFloat(d)) && new Date(d).getTime() > 0) return true;
    return new Date(parseFloat(d)).getTime() > 0;
};

export const isValidDate = (date: any) => date instanceof Date && String(date) !== 'Invalid Date';

export const getDateObj = (d: any, format?: string) => {
    if (format) return new Date(dateFnsFormat(d, format).toString());
    if (d && isNumber(d)) {
        let ts = parseInt(d);
        return new Date(`${ts}`.length === 10 ? ts * 1000 : ts);
    }
    if (d && !isDate(d)) return null;
    if (d) return new Date(d);
    return new Date();
};
export const getTimestamp = (d?: any, format?: any) => {
    let dateObj = getDateObj(d, format);
    return dateObj ? dateObj.getTime() : null;
};

export const diffDateTime = (type: string, diff?: any, cur?: string, toDate?: string) => {
    if (!type || !isNumber(diff)) return null;
    let now = cur || null,
        dateObj = getDateObj(now);
    if (!dateObj) return null;
    switch (type) {
        case 'ms':
            dateObj.setMilliseconds(dateObj.getMilliseconds() + diff);
            break;
        case 's':
            dateObj.setSeconds(dateObj.getSeconds() + diff);
            break;
        case 'min':
            dateObj.setMinutes(dateObj.getMinutes() + diff);
            break;
        case 'h':
            dateObj.setHours(dateObj.getHours() + diff);
            break;
        case 'd':
            dateObj.setDate(dateObj.getDate() + diff);
            break;
        case 'm':
            dateObj.setMonth(dateObj.getMonth() + diff);
            break;
        case 'y':
            dateObj.setFullYear(dateObj.getFullYear() + diff);
            break;
        default:
            break;
    }
    return toDate ? dateObj : dateObj.getTime();
};

export const dateDiff = (type: string, past: any, present: any) => {
    let t1 = getTimestamp(past),
        t2 = getTimestamp(present),
        d1 = getDateObj(past),
        d2 = getDateObj(present);
    if (!t1 || !t2 || !d1 || !d2 || t2 < t1) return null;
    let diffMs = t2 - t1;
    switch (type) {
        case 'ms':
            return diffMs;
        case 's':
            return parseInt((diffMs / 1000) as any);
        case 'min':
            return parseInt((diffMs / (60 * 1000)) as any);
        case 'h':
            let hms = 3600 * 1000;
            return diffMs > hms ? parseInt((diffMs / hms) as any) : 0;
        case 'd':
            let dms = 24 * 3600 * 1000;
            return diffMs > dms ? parseInt((diffMs / dms) as any) : 0;
        case 'w':
            let wms = 24 * 3600 * 1000 * 7;
            return diffMs > wms ? parseInt((diffMs / wms) as any) : 0;
        case 'm':
            let d1Y = d1.getFullYear(),
                d2Y = d2.getFullYear();
            let d1M = d1.getMonth(),
                d2M = d2.getMonth();
            let result = d2M + 12 * d2Y - (d1M + 12 * d1Y);
            if (result === 1) {
                let d1D = d1.getDate(),
                    d2D = d2.getDate();
                if (d2D - d1D < 0) result = 0;
            }
            return result;
        case 'y':
            return d2.getFullYear() - d1.getFullYear();
        default:
            return null;
    }
};

export const getDelayTime = (from: any, type: any, value: any) => {
    let time = 0;
    let timeout = diffDateTime(type, value, from);
    let now = getTimestamp();

    if (timeout !== null && typeof timeout === 'number' && now !== null && typeof now === 'number' && timeout > now) {
        time = dateDiff('ms', now, timeout) ?? 0;
    }

    return time;
};
