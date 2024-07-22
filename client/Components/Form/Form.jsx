import React, { useState, useEffect, useRef, useCallback } from 'react';
import $ from 'jquery';

import Input from './Input';
import Checkbox from './Checkbox';
import TextArea from './TextArea';
import Panel from '../Site/Panel';

import formFields from './formFields.json';

const Form = (props) => {
    const [state, setState] = useState({});
    const formRef = useRef(null);

    const setInitialValues = useCallback(
        (props) => {
            if (props.initialValues) {
                for (let [key, value] of Object.entries(props.initialValues)) {
                    if (!state[key]) {
                        setState((prevState) => ({ ...prevState, [key]: value }));
                    }
                }
            }
        },
        [state]
    );

    useEffect(() => {
        $.validator.unobtrusive.parse('form');
        const validator = $(formRef.current).validate();

        setInitialValues(props);

        return () => {
            validator.destroy();
        };
    }, [props, setInitialValues]);

    const onChange = useCallback((field, event) => {
        setState((prevState) => ({ ...prevState, [field]: event.target.value }));
    }, []);

    const onCheckboxChange = useCallback((field, event) => {
        setState((prevState) => ({ ...prevState, [field]: event.target.checked }));
    }, []);

    const onSubmit = useCallback(
        (event) => {
            event.preventDefault();

            if (!$(formRef.current).valid()) {
                return;
            }

            if (props.onSubmit) {
                props.onSubmit(state);
            }
        },
        [props, state]
    );

    const fieldsToRender = formFields[props.name].map((field) => {
        switch (field.inputType) {
            case 'checkbox':
                return (
                    <Checkbox
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        fieldClass={field.fieldClass}
                        onChange={(event) => onCheckboxChange(field.name, event)}
                        checked={state[field.name]}
                    />
                );
            case 'textarea':
                return (
                    <TextArea
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        fieldClass={field.fieldClass}
                        labelClass={field.labelClass}
                        onChange={(event) => onChange(field.name, event)}
                        value={state[field.name]}
                        validationAttributes={field.validationProperties}
                    />
                );
            default:
                return (
                    <Input
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        placeholder={field.placeholder}
                        validationAttributes={field.validationProperties}
                        fieldClass={field.fieldClass}
                        labelClass={field.labelClass}
                        type={field.inputType}
                        onChange={(event) => onChange(field.name, event)}
                        value={state[field.name]}
                    />
                );
        }
    });

    let content = (
        <form className='form form-horizontal' onSubmit={onSubmit} ref={formRef}>
            {fieldsToRender}
            {props.children}
            <div className='form-group'>
                <div className={props.buttonClass}>
                    <button type='submit' className='btn btn-primary' disabled={props.apiLoading}>
                        {props.buttonText || 'Submit'}{' '}
                        {props.apiLoading ? <span className='spinner button-spinner' /> : null}
                    </button>
                </div>
            </div>
        </form>
    );

    if (props.panelTitle) {
        return <Panel title={props.panelTitle}>{content}</Panel>;
    }

    return content;
};

export default Form;
