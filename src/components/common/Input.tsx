'use client';

import withI18n from '@/hooks/I18nHocs';
import { Fragment, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import anchorme from 'anchorme';

import { genUuid } from '@/utils/Utils';
import { preventDefaultClickEvent } from '@/utils/CoreUtils';
import { textTransform } from '@/utils/StringUtils';

import ImageViewer from './ImageViewer';

import { HocsProps } from '@/models/CommonModels';
import { InputProps } from '@/models/ComponentModels';

import IconRemove from '@static/icons/ic_cancel_filled.svg';

const Max_Length: number = 256;

const formatLargeNumberWithCommas = (numberString: any) => {
    if (!/^\d+$/.test(numberString)) return numberString;

    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Input = ({
    i18n,
    placeholder,
    plh,
    value,
    label,
    required,
    isError,
    helperText,
    isNumber,
    isDisabled,
    softDisabled,
    noMaxLength,
    isOutLine,
    styles,
    startIcon,
    endIcon,
    endComp,
    autoFocus,
    isCurrency,
    isSearch,
    removeable = true,
    multiline,
    heightArea,
    inputRef,
    isAutoHeight,
    typeTypePlh = '',
    pattern,
    maxLength,
    subTitle,
    className,
    inputType,
    isToolText,
    isMoney,
    isNoSpace,
    isUppercase,
    onChange = () => null,
    onChangeText = () => null,
    onBlur = () => null,
    onFocus = () => null,
    onEnter = () => null,
    onKeyDown = () => null,
    onRemove = () => null,
}: InputProps & HocsProps<any>): React.ReactNode => {
    const [inputId] = useState<string>(genUuid());

    const _refInput = useRef<HTMLElement | null>(null);

    const _maxLength = noMaxLength ? null : maxLength || Max_Length;

    const isDisable = isDisabled || softDisabled;

    useEffect(() => {
        const elm: HTMLElement | null = document.getElementById(inputId);
        if (autoFocus && elm) {
            setTimeout(() => elm.focus(), 500);
        }
        _refInput.current = elm;
        if (isAutoHeight && multiline) {
            handleAutoGrow();
        }
    }, []);

    const handleChange = (e: any) => {
        let text: string = e?.target?.value;
        if (isNumber) text = text.replace(/\D/g, '');
        if (isNoSpace) text = text.replace(/\s/g, '');
        if (isUppercase) text = text.toUpperCase();
        if (_maxLength) text = text.substring(0, _maxLength);

        if (isCurrency) {
            text = text.replace(/[^0-9]/g, '');
            text = formatLargeNumberWithCommas(text ?? 0);
        }
        onChange(e);
        onChangeText(text);
    };

    const handleClickWrapper = (e: any) => {
        preventDefaultClickEvent(e);
        _refInput.current?.focus();
    };

    const handleRemoveText = (e: any) => {
        preventDefaultClickEvent(e);
        onChangeText('');
        _refInput.current?.focus();
        if (onRemove) onRemove();
        if (isAutoHeight) handleAutoGrow(true);
    };

    const handleAutoGrow = (isRemove?: boolean) => {
        if (!_refInput.current) return;
        _refInput.current.style.height = `${heightArea ?? 45}px`;
        if (!isRemove) _refInput.current.style.height = _refInput.current.scrollHeight + 'px';
    };

    const handleOnPaste = (e: any) => {
        let { target, clipboardData } = e;
        let pastedText = clipboardData.getData('Text').trim();
        if (inputType === 'email' && pastedText) {
            e.preventDefault();
            e.stopPropagation();
            let email = pastedText.replace(/(\r\n|\n|\r)/gm, ' ');
            let emails = anchorme.list(pastedText);
            email = emails.length
                ? (emails.find((i: any) => i.isEmail) || { string: '' }).string.replace('mailto:', '')
                : pastedText;
            target.setRangeText(email, target.selectionStart, target.selectionEnd, 'end');
            onChange({ ...e, target });
            onChangeText(target.value);
        }
    };

    const handleKeydown = (e: any) => {
        onKeyDown?.(e);
        if (e.key === 'Enter') {
            onEnter();
        }
    };

    const inputProp: any = {
        value,
        placeholder:
            plh ||
            (placeholder
                ? i18n.t('enter', { str: textTransform(typeTypePlh, placeholder) })
                : i18n.t(noMaxLength ? 'importContent' : 'plhLength', { length: _maxLength })),
        id: inputId,
        ref: inputRef,
        disabled: isDisable,
        className: '',
        ...(!isDisable && { autoFocus }),
        ...(pattern && { pattern }),
        ...(isAutoHeight && {
            onInput: () => handleAutoGrow(),
        }),
        onChange: handleChange,
        onPaste: handleOnPaste,
        onFocus: onFocus,
        onBlur: onBlur,
        onKeyDown: handleKeydown,
    };

    const _renderToolTranformText = (): React.ReactElement => {
        return (
            <div className='flex items-center gap-2 opacity-50'>
                {[
                    ['AA', 'u'],
                    ['Aa', 'ca'],
                ].map((item, index: number) => {
                    const [text, action] = item;
                    return (
                        <Fragment key={text}>
                            <div
                                onClick={() => {
                                    let _value = {
                                        target: { value: textTransform(action, textTransform('l', value)) },
                                    };
                                    handleChange(_value);
                                }}
                            >
                                {text}
                            </div>
                            {!index && <span>|</span>}
                        </Fragment>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            {!!label && (
                <div className='space-between'>
                    <div className=''>
                        <b
                            className='block text-gray-800 font-semibold text-sm'
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                        {!!required && <span className='required'>*</span>}
                    </div>
                    {!!subTitle && subTitle}
                    {!!isToolText && _renderToolTranformText()}
                </div>
            )}
            <div className='mt-2'>
                <input
                    type='text'
                    name='inputname'
                    className='block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800'
                />
            </div>
            <p className='pt-1 block text-gray-500 text-sm'>Some Description</p>
        </div>
    );
};

export default withI18n()(Input) as React.FC<InputProps>;
