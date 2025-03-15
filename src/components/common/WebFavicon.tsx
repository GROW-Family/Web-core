import React, { Fragment } from 'react';

import { domains } from '@/constants/Domain';

type Props = {
    agencyId: string;
    isNotify?: boolean;
}

const WebFavicon = ({ agencyId, isNotify }: Props) => {
    let _urlBase = `${domains.cdn}web/agency/${agencyId}/favicon/`;
    if (isNotify) _urlBase += 'notify/';
    return (
        <Fragment>
            <link rel="apple-touch-icon" sizes="180x180" href={`${_urlBase}apple-touch-icon.png`} />
            <link rel="icon" type="image/png" sizes="32x32" href={`${_urlBase}favicon-32x32.png`} />
            <link rel="icon" type="image/png" sizes="16x16" href={`${_urlBase}favicon-16x16.png`} />
            <link rel="manifest" href={`${_urlBase}site.webmanifest`} />
            <link rel="shortcut icon" href={`${_urlBase}favicon.ico`} />
            <link rel="mask-icon" href={`${_urlBase}safari-pinned-tab.svg`} color={'#00B1FF'} />
            <meta name="msapplication-TileColor" content={'#00B1FF'} />
            <meta name="msapplication-TileImage" content={`${_urlBase}mstile-144x144.png`} />
            <meta name="msapplication-config" content={`${_urlBase}browserconfig.xml`} />
            <meta name="theme-color" content={'#ffffff'} />
        </Fragment>
    )
};

export default WebFavicon;