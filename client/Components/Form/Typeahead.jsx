import React, { useCallback, forwardRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import uuid from 'uuid';

const TypeaheadComponent = forwardRef(
    (
        {
            label: labelProp,
            name,
            labelClass: labelClassProp,
            fieldClass,
            options,
            labelKey,
            emptyLabel,
            onChange: onChangeProp,
            placeholder,
            autoFocus,
            dropup,
            minLength,
            onInputChange: onInputChangeProp,
            submitFormOnEnter,
            onKeyDown: onKeyDownProp,
            disabled,
            validationMessage,
            children,
            noGroup
        },
        ref
    ) => {
        const onChange = useCallback(
            (selected) => {
                if (onChangeProp) {
                    onChangeProp(selected);
                }
            },
            [onChangeProp]
        );

        const onInputChange = useCallback(
            (text, event) => {
                if (onInputChangeProp) {
                    onInputChangeProp(text, event);
                }
            },
            [onInputChangeProp]
        );

        const onKeyDown = useCallback(
            (event) => {
                if (onKeyDownProp) {
                    onKeyDownProp(event);
                }
            },
            [onKeyDownProp]
        );

        const label = labelProp ? (
            <label htmlFor={name} className={`${labelClassProp} control-label`}>
                {labelProp}
            </label>
        ) : null;

        const control = (
            <div>
                {label}
                <div className={fieldClass}>
                    <Typeahead
                        id={name || uuid.v1()}
                        ref={ref}
                        options={options}
                        labelKey={labelKey}
                        emptyLabel={emptyLabel}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                        dropup={dropup}
                        minLength={minLength}
                        onInputChange={onInputChange}
                        submitFormOnEnter={submitFormOnEnter}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                    />
                    {validationMessage ? (
                        <span className='help-block'>{validationMessage} </span>
                    ) : null}
                </div>
                {children}
            </div>
        );

        if (noGroup) {
            return control;
        }

        return <div className='form-group'>{control}</div>;
    }
);

TypeaheadComponent.displayName = 'Typeahead';

export default TypeaheadComponent;
