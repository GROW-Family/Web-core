'use client';

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

type Props = {
    isVisible: boolean;
    children: React.ReactNode;
};

const Modal = ({ isVisible, children }: Props) => {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        let timer: any = null;
        if (isVisible) {
            setShow(true);
        } else {
            timer = setTimeout(() => {
                setShow(false);
            }, 330);
        }
        return () => clearTimeout(timer);
    }, [isVisible]);

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className='fixed inset-0 w-full h-full flex z-[99999]'>{children}</div>,
        document.getElementById('portal-root') as any,
    );
};

export default Modal;
