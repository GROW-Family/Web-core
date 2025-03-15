import React from 'react';
import clsx from 'clsx';

import { LineProps } from '@/models/ComponentModels';

const Line = (props: LineProps): React.ReactNode => {
    const { width, height, vertical, className, style, noMargin } = props;
    const _width = width ?? (vertical ? 2 : '100%');
    const _height = height ?? (vertical ? '100%' : 2);
    return (
        <div
            style={{
                minWidth: _width,
                maxWidth: _width,
                minHeight: _height,
                maxHeight: _height,
                ...(noMargin && { margin: 0 }),
                ...style,
            }}
            className={clsx('bg-gray-950', className)}
        />
    );
};

export default Line as React.FC<LineProps>;
