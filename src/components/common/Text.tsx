import React from 'react';
import clsx from 'clsx';

import { TextProps } from '@/models/ComponentModels';

const Text: React.FC<TextProps> = ({
  text,
  type = 'p',
  color = 'primary',
  size = 'text',
  className,
  style,
  ...props
}) => {
  return React.createElement(
    type,
    {
      ...props,
      className: clsx(
        'm-0',
        className,
        {
          [`text-${color}`]: color,
          [`text-${size}`]: size,
        }
      ),
      style,
    },
    text
  );
};

export default Text;
