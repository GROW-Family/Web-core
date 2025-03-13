'use client';

import clsx from 'clsx';
import { memo, useEffect, useRef, useState } from 'react';
import { ReactSVG } from 'react-svg';

import { getImageSize } from '@/utils/FileUtils';
import { isArray, isNumber, isString } from '@/utils/Utils';
import { getSvgStyle } from '@/utils/StyleUtils';
import { getHTMLAttributes } from '@/utils/StringUtils';

import { colors } from '@/styles/theme';

import { ImageViewerProps } from '@/models/ComponentModels';

import defaultError from '@/static/images/img_error.png';

type CompStates = {
    expectWidth?: any;
    expectHeight?: any;
    renderId?: string;
};

const getSRC = (src: any) => (src ? src.default?.src || src.src || src.default || String(src) : '');

const ImageViewer = ({
    id,
    src,
    useRatio,
    fallbackSrc,
    className,
    style,
    size,
    width,
    height,
    theme,
    children,
    clickable,
    draggable,
    disable,
    softDisabled,
    circle,
    lazyload,
    bgImg,
    minimum,
    selectable,
    svg,
    attributes,
    crossOrigin,
    color,
    customKey,
    selector,
    alt,
    resizeMode = 'cover',
    rotate,
    isCircle,
    renderId,
    overflow,
    defaultSrc,
    onMouseOver,
    onMouseDown,
    onRef,
    onClick,
    onError,
    onMouseLeave,
    isObectFit,
    expectWidth,
    expectHeight,
}: ImageViewerProps & CompStates) => {
    const _mounted = useRef(false);
    const [injectFailed, setInjectFailed] = useState<boolean>(false);
    const [source, setSource] = useState(getSRC(src?.src));
    const [renderReady, setRenderReady] = useState<boolean>(!source || (source && !useRatio));
    const [isError, setIsError] = useState<boolean>(false);
    const [expectSize, setExpectSize] = useState<{ width?: number; height?: number }>({});
    const [reRender, setReRender] = useState(false);

    const isFunc = typeof onClick === 'function';
    const isHandleError = !!(lazyload || fallbackSrc || onError);
    const imgSize = size ? (isNumber(size) ? size + 'px' : size) : 16;
    const imgCursor =
        disable || softDisabled ? 'not-allowed' : clickable || isFunc ? 'pointer' : draggable ? 'grab' : 'default';
    const imgConstraint = {
        width: expectWidth ?? width ?? imgSize,
        height: expectHeight ?? height ?? imgSize,
    };

    let _style = { ...(style || {}), ...(isObectFit && { objectFit: 'contain' }) };

    useEffect(() => {
        _mounted.current = true;
        return () => {
            _mounted.current = false;
        };
    }, []);

    useEffect(() => {
        setIsError(false);
        setRenderReady(!src || (src && !useRatio));
        handleGetExpectSize();
    }, [useRatio]);

    const baseClass = clsx(
        `flex h-full`,
        resizeMode && `object-${resizeMode}`,
        circle && 'rounded-full',
        imgCursor !== 'default' && `cursor-${imgCursor}`,
        disable && 'opacity-50',
        overflow && 'absolute',
        isNumber(rotate) && `rotate-[${rotate}deg] transition-all duration-200`,
        minimum && `min-w-[${expectWidth ?? width ?? imgSize}px]`,
    );

    const handleError = () => {
        if (!isError) {
            onError?.();
            setSource(fallbackSrc || defaultError);
            setIsError(true);
        }
    };

    const handleBeforeInjection = (svgNode: any) => {
        const { id, gradient, color, gradientSelector } = svg;
        let _gradient = gradient;
        if ((color || '').includes('gradient')) {
            let gradientAngles: any = {
                'to bottom': { x2: '0', y2: '1' },
                'to bottom right': { x1: '.5', x2: '.5', y2: '1' },
            };
            _gradient = {
                ...gradientAngles[color.split(/[(,]/)[1]],
                colors: color.match(/#+\w{3,6}/g),
            };
        }
        if (_gradient) {
            let pathNodes = svgNode.querySelectorAll(gradientSelector || 'g[fill*="#"' || '  [fill*="#"]');
            if (pathNodes.length) {
                let { colors = [], x1 = '0', y1 = '0', x2 = '1', y2 = '1' } = _gradient;
                let gradientId = `svg${id || renderId}`;
                let stopColorsHtml = colors
                    .map((color: any, index: number) => {
                        if (isString(color)) {
                            color = [color];
                        }
                        let [stopColor, attributes] = color;
                        return `<stop ${getHTMLAttributes({
                            offset: index,
                            'stop-color': stopColor,
                            ...attributes,
                        })} />`;
                    })
                    .join('');
                let gradientHtml = `<defs><linearGradient ${getHTMLAttributes({
                    id: gradientId,
                    x1,
                    y1,
                    x2,
                    y2,
                })}>${stopColorsHtml}</linearGradient></defs>`;
                svgNode.insertAdjacentHTML('afterbegin', gradientHtml);
                pathNodes.forEach((i: any) => i.setAttribute('fill', `url(#${gradientId})`));
            }
        }
        return svgNode.setAttribute('style', 'height:100%');
    };

    const handleAfterInjection = (err: any): void => {
        if (err && _mounted.current && !injectFailed) {
            setInjectFailed(true);
            setReRender((prev) => !prev);
        }
    };

    const imgPropProducts = {
        draggable,
        crossOrigin,
        onMouseOver,
        onMouseLeave,
        onMouseDown,
        className: clsx(baseClass, className),
        onClick: (e: any) => !(disable || softDisabled) && isFunc && onClick(e),
        onError: handleError,
        alt: alt ?? '',
        ref: (_ref: any) => onRef?.(_ref),
        ...(isError && isHandleError && { 'origin-src': src }),
        ...(id && { id }),
        ...imgConstraint,
    };

    const handleGetExpectSize = () => {
        const { src: _source } = src;
        let _src = getSRC(_source);
        if (_src && useRatio) {
            getImageSize(_src).then((sizes) => {
                if (!_mounted) return;
                const { width: actualWidth, height: actualHeight }: any = sizes;
                let expectWidth = size ?? width ?? style?.width;
                let expectHeight = size ?? height ?? style?.height;
                switch (useRatio) {
                    case 'width':
                        expectWidth = (actualWidth * Number(expectHeight)) / actualHeight;
                        break;
                    case 'height':
                        expectHeight = (actualHeight * Number(expectWidth)) / actualWidth;
                        break;
                    default:
                        break;
                }
                setExpectSize({
                    width: isNaN(expectWidth) ? null : expectWidth,
                    height: isNaN(expectHeight) ? null : expectHeight,
                });
                setRenderReady(true);
            });
        }
    };

    const getColor = (...args: any[]) => {
        let id = args[0],
            opacity = args[1] || 'main';
        if (isArray(args[0])) {
            id = args[0][0];
            opacity = args[0][1] || 'main';
        }

        return theme?.palette?.[id]?.[opacity] || colors[id] || id;
    };

    if (!renderReady) return null;

    if (svg) {
        if (color || svg.color) {
            imgPropProducts.className = clsx(
                baseClass,
                className,
                clsx(
                    getSvgStyle({
                        ...svg,
                        selector,
                        customKey,
                        color: getColor(color || svg.color),
                    }),
                ),
            );
        }
        Object.assign(imgPropProducts, {
            beforeInjection: handleBeforeInjection,
            afterInjection: handleAfterInjection,
        });
        return <ReactSVG {...{ ...imgPropProducts, ...svg, src: source, style: _style }} />;
    }

    return (
        <img
            alt={alt ?? ''}
            loading='lazy'
            {...{ ...imgPropProducts, src: source, style: _style, ...attributes }}
        />
    );
};

export default memo(ImageViewer);
