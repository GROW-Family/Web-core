export type I18nProp = {
    t: Function;
    j: Function;
    lng: string;
    lngId: string;
};

export type HocsProps<Classes> = {
    classes: Classes;
    i18n: I18nProp;
};