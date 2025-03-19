'use client';

import React from 'react';
import clsx from 'clsx';

import ImageViewer from './ImageViewer';
import Tooltip from './Tooltip';

import { CheckboxProps } from '@/models/ComponentModels';

import squareUncheck from '@static/icons/ic_square_uncheck.svg';
import squareChecked from '@static/icons/ic_square_tick_box_filled.svg';
import circleUncheck from '@static/icons/ic_circle_uncheck.svg';
import circleChecked from '@static/icons/ic_circle_checked_filled.svg';

const icons = {
    square: {
        uncheck: squareUncheck,
        checked: squareChecked,
    },
    circle: {
        uncheck: circleUncheck,
        checked: circleChecked,
    },
};

const Checkbox: React.FC<CheckboxProps> = ({
    className,
    style,
    gap = 8,
    label,
    labelLeft,
    checked,
    isDisabledColor,
    checkedColor = 'text-blue-500',
    maxWidth,
    disabled,
    softDisabled,
    isCircle,
    onChange,
    tooltip,
}) => {
    const wrapperProps = {
        className: clsx(
            'flex items-center select-none transition',
            labelLeft && 'flex-row-reverse justify-end',
            maxWidth && 'w-full',
            disabled && 'opacity-50 cursor-not-allowed',
            softDisabled && 'pointer-events-none cursor-default',
            className,
        ),
        style: { ...style, gap },
        ...(!disabled && { onClick: (e: React.MouseEvent) => onChange?.(e) }),
    };

    const imageProps = {
        svg: true,
        color: isDisabledColor ? 'text-gray-500' : checked ? 'text-blue-500' : 'text-gray-700',
        src: icons[isCircle ? 'circle' : 'square'][checked ? 'checked' : 'uncheck'],
    };

    return (
        <div {...wrapperProps}>
            <ImageViewer {...imageProps} size={20} />
            {label && (
                <Tooltip {...(tooltip && { title: tooltip })}>
                    <span className={clsx('ml-2 text-sm', checked ? checkedColor : 'text-gray-700')}>{label}</span>
                </Tooltip>
            )}
        </div>
    );
};

export default Checkbox;
