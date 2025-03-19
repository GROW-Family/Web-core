'use client';

import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { TooltipProps } from '@/models/ComponentModels';

const Tooltip: React.FC<TooltipProps> = ({
  title,
  placement = 'top',
  noneWrap,
  center,
  hidden,
  className,
  delayAfterChange,
  disableInteractive = true,
  children,
}) => {
  const [forceHide, setForceHide] = useState(false);

  useEffect(() => {
    if (delayAfterChange && title) {
      setForceHide(true);
      const timer = setTimeout(() => setForceHide(false), delayAfterChange);
      return () => clearTimeout(timer);
    }
  }, [title, delayAfterChange]);

  if (!children) return null;
  if (!title) return <>{children}</>;

  return (
    <div className="relative inline-block">
      <div className="group relative">
        {children}
        <div
          className={clsx(
            'absolute z-50 w-max max-w-xs rounded bg-gray-900 p-2 text-white text-sm opacity-0 transition-opacity group-hover:opacity-100',
            noneWrap ? 'whitespace-nowrap' : 'whitespace-pre-wrap',
            center && 'text-center',
            hidden || forceHide ? 'hidden' : '',
            className,
            {
              'top-full left-1/2 -translate-x-1/2 mt-1': placement === 'bottom',
              'bottom-full left-1/2 -translate-x-1/2 mb-1': placement === 'top',
              'left-full top-1/2 -translate-y-1/2 ml-1': placement === 'right',
              'right-full top-1/2 -translate-y-1/2 mr-1': placement === 'left',
            }
          )}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
