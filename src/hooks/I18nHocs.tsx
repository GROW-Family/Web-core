import React, { forwardRef, useState, useEffect } from 'react';

import {
    getI18nLng,
    onI18nChangeLng,
    rmI18nChangeLng,
    getI18nLeadedLng,
    setI18nLeadedLng,
    i18nText,
} from '@libs/i18n';

import { useIsMounted } from '@utils/CoreUtils';

const getDisplayName = (WrappedComponent: React.ElementType) => {
    if (typeof WrappedComponent === 'string') {
        return WrappedComponent;
    }

    return (WrappedComponent as React.ComponentType).displayName || 
           (WrappedComponent as React.ComponentType).name || 
           'Component';
};


const withI18n =
    (...inputLngs: any) =>
    (WrappedComponent: React.ElementType) => {
        const WrappedComponentName = getDisplayName(WrappedComponent);

        const I18nHocs = forwardRef(function (props, ref) {
            const isMounted = useIsMounted();

            const mainInputLng = useState(inputLngs[0] ? 'c_' + inputLngs[0] : '')[0];
            const [componentId] = useState(WrappedComponentName + '_' + String(Math.random()).substring(2));
            const [isReady, setReady] = useState(
                inputLngs.length ? inputLngs.every((i: string) => !!getI18nLeadedLng('c_' + i)) : true,
            );
            const [lng, setLng] = useState(getI18nLng());

            const initLngs = async () => {
                for (let inputLng of inputLngs) {
                    if (isMounted()) {
                        let imported = await import('@libs/i18n/lngs/common/index');
                        if (!isMounted()) return;
                        setI18nLeadedLng('c_' + inputLng, imported.default);
                    }
                }
                setReady(true);
            };

            useEffect(() => {
                if (!isReady) initLngs();
                onI18nChangeLng(componentId, (_lng: string) => setLng(_lng));
                return () => {
                    rmI18nChangeLng(componentId);
                };
            }, []);

            if (!isReady) return null;

            let propText = (...args: any) => i18nText(args[0], { ...args[1], m: mainInputLng });
            let propJoin = (...args: any) => args.map((i: any) => propText(i)).join(' ');

            return (
                <WrappedComponent
                    {...{ ...props, ref }}
                    i18n={{
                        lng,
                        t: propText,
                        j: propJoin,
                        lngId: mainInputLng,
                    }}
                />
            );
        });

        I18nHocs.displayName = `WithI18n(${WrappedComponentName})`;

        return I18nHocs;
    };

export default withI18n;
