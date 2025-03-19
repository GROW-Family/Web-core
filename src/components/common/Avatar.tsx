'use client';

import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { isFunction, isString } from '@utils/Utils';
import { getColor, toRgbA } from '@/utils/StyleUtils';
import { getUploadFileUrl } from '@/utils/FileUtils';

import { avatarColors, cStyles } from '@/styles/theme';

import ImageViewer from './ImageViewer';

import { AvatarProps } from '@/models/ComponentModels';
import { HocsProps } from '@/models/CommonModels';

import noImage from '@static/images/img_error.png';

const Avatar: React.FC<AvatarProps & HocsProps<any>> = ({
    className,
    src,
    name,
    style,
    size,
    txtSize,
    border,
    isSvg,
    borderSize,
    borderColor,
    borderRadius,
    isCustomed,
    isDueTime,
    clickable,
    onClick,
    isPreview,
    whiteBg,
    imageProps,
}: AvatarProps & HocsProps<any>) => {
    const [isError, setErrorStatus] = useState<boolean>(false);
    const [borderClsx, setBorderClsx] = useState<any>();
    useEffect(() => {
        isError && setErrorStatus(false);
    }, [src, name]);

    useEffect(() => {
        if (border || borderColor || borderSize) {
            setBorderClsx(
                clsx({
                    '&::after': {
                        content: '""',
                        zIndex: 1,
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='100' ry='100' stroke='${getColor(
                            borderColor || 'white',
                        ).replace('#', '%23')}' stroke-width='${
                            borderSize ?? 2
                        }' stroke-dasharray='0' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
                        ...(cStyles.overlayAbsolute && typeof cStyles.overlayAbsolute === 'object'
                            ? cStyles.overlayAbsolute
                            : {}),
                    },
                }),
            );
        }
    }, [border, borderColor, borderSize]);

    const getNameAvatar = (str: string) => (isString(str) ? str.charAt(0).toUpperCase() : '');

    const bgColor =
        (src && !isError && 'transparent') ||
        (name && avatarColors[isCustomed ? '+' : (getNameAvatar(name).toUpperCase() as keyof typeof avatarColors)]);

    const avatarSize = size ?? 32,
        isClickable = isFunction(onClick) || clickable;

    const wrapperStyles = {
        width: avatarSize,
        minWidth: avatarSize,
        height: avatarSize,
        minHeight: avatarSize,
        background: toRgbA(bgColor, 0.2),
        opacity: isDueTime ? 0.5 : 1,
        fontSize: txtSize,
        color: bgColor,
        ...(borderRadius && { borderRadius }),
        ...(isClickable && { cursor: 'pointer' }),
        ...style,
    };

    const wrapperClassName = clsx(
        'relative overflow-hidden rounded-full flex items-center justify-center select-none text-white',
        className,
        borderClsx,
        {
            'flex items-center justify-center': !(src && !isError) && !!name,
        },
    );

    const mainNode = (
        <div
            style={wrapperStyles}
            className={wrapperClassName}
            onClick={(e: any) => onClick && onClick(e)}
        >
            {(isCustomed && name) ||
                (src && !isError && (
                    <ImageViewer
                        lazyload
                        draggable={false}
                        clickable={isClickable}
                        size={avatarSize}
                        isSvg={isSvg}
                        src={src}
                        onError={() => setErrorStatus(true)}
                        {...imageProps}
                    />
                )) || (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            borderRadius: '50%',
                        }}
                    >
                        {name ? (
                            <div
                                className='font-bold leading-normal'
                                style={{
                                    color: toRgbA(bgColor, 1),
                                    ...(size === 20 &&
                                        !(src && !isError) && {
                                            fontSize: 12,
                                        }),
                                }}
                            >
                                {getNameAvatar(name)}
                            </div>
                        ) : (
                            <ImageViewer
                                src={noImage}
                                size={'70%'}
                                draggable={false}
                            />
                        )}
                    </div>
                )}
        </div>
    );

    return <div>{whiteBg ? <div style={{ background: 'white', borderRadius: '50%' }}>{mainNode}</div> : mainNode}</div>;
};

export default Avatar as React.FC<AvatarProps>;
