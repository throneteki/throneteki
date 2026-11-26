import React, { forwardRef } from 'react';
import {
    Description,
    FieldError,
    Input,
    InputGroup,
    Label,
    TextArea,
    TextField
} from '@heroui/react';
import classNames from 'classnames';

const FieldShell = ({
    label,
    description,
    errorMessage,
    isInvalid,
    isDisabled,
    isRequired,
    isReadOnly,
    className,
    'aria-label': ariaLabel,
    children
}) => (
    <TextField
        className={classNames('flex flex-col gap-1', className)}
        isInvalid={isInvalid ?? !!errorMessage}
        isDisabled={isDisabled}
        isRequired={isRequired}
        isReadOnly={isReadOnly}
        aria-label={label ? undefined : ariaLabel}
        validationBehavior='aria'
    >
        {label && <Label className='text-sm text-ink-dim'>{label}</Label>}
        {children}
        {description && <Description className='text-sm text-ink-faint'>{description}</Description>}
        {errorMessage && <FieldError className='text-sm text-danger'>{errorMessage}</FieldError>}
    </TextField>
);

const inputProps = ({ onValueChange, onChange, ...props }) => ({
    ...props,
    onChange: (event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
    }
});

const pick = (props) => {
    const {
        label,
        description,
        errorMessage,
        isInvalid,
        isDisabled,
        isRequired,
        isReadOnly,
        className,
        inputClassName,
        ...rest
    } = props;

    return [
        {
            label,
            description,
            errorMessage,
            isInvalid,
            isDisabled,
            isRequired,
            isReadOnly,
            className,
            'aria-label': rest['aria-label']
        },
        inputClassName,
        rest
    ];
};

const Field = forwardRef(function Field(props, ref) {
    const [shell, inputClassName, { startContent, endContent, ...rest }] = pick(props);

    if (startContent || endContent) {
        return (
            <FieldShell {...shell}>
                <InputGroup>
                    {startContent && <InputGroup.Prefix>{startContent}</InputGroup.Prefix>}
                    <InputGroup.Input
                        ref={ref}
                        className={classNames('w-full', inputClassName)}
                        {...inputProps(rest)}
                    />
                    {endContent && <InputGroup.Suffix>{endContent}</InputGroup.Suffix>}
                </InputGroup>
            </FieldShell>
        );
    }

    return (
        <FieldShell {...shell}>
            <Input
                ref={ref}
                className={classNames('w-full', inputClassName)}
                {...inputProps(rest)}
            />
        </FieldShell>
    );
});

export const TextAreaField = forwardRef(function TextAreaField(props, ref) {
    const [shell, inputClassName, { minRows, ...rest }] = pick(props);

    return (
        <FieldShell {...shell}>
            <TextArea
                ref={ref}
                rows={minRows}
                className={classNames('w-full', inputClassName)}
                {...inputProps(rest)}
            />
        </FieldShell>
    );
});

export default Field;
