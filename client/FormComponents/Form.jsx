import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';

import Input from './Input';

import formFields from './formFields.json';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        $.validator.unobtrusive.parse('form');

        this.validator = $('form').validate();
    }

    componentWillUnmount() {
        this.validator.destroy();
    }

    onChange(field, event) {
        var newState = {};

        newState[field] = event.target.value;
        this.setState(newState);
    }

    onSubmit(event) {
        event.preventDefault();

        if(!$('form').valid()) {
            return;
        }

        if(this.props.onSubmit) {
            this.props.onSubmit(this.state);
        }
    }

    render() {
        const fieldsToRender = formFields[this.props.name].map(field => {
            return (<Input key={ field.name } name={ field.name } label={ field.label } placeholder={ field.placeholder }
                validationAttributes={ field.validationProperties } fieldClass={ field.fieldClass } labelClass={ field.labelClass }
                type={ field.inputType } onChange={ this.onChange.bind(this, field.name) } value={ this.state[field.name] } />);
        });

        return (<form className='form form-horizontal' onSubmit={ this.onSubmit }>
            { fieldsToRender }
            { this.props.children }
            <div className='form-group'>
                <div className='col-sm-offset-4 col-sm-3'>
                    <button ref='submit' type='submit' className='btn btn-primary' disabled={ this.props.apiLoading }>
                        { this.props.buttonText || 'Submit' } { this.props.apiLoading ? <span className='spinner button-spinner' /> : null }
                    </button>
                </div>
            </div>
        </form>);
    }
}

Form.displayName = 'Form';
Form.propTypes = {
    apiLoading: PropTypes.bool,
    buttonText: PropTypes.string,
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    onSubmit: PropTypes.func
};

export default Form;
