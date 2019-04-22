import React from 'react';
import PropTypes from 'prop-types';

class TextArea extends React.Component {
    render() {
        let labelClass = 'control-label';
        if(this.props.labelClass) {
            labelClass += ` ${this.props.labelClass}`;
        }

        return (
            <div className='form-group'>
                <label htmlFor={ this.props.name } className={ labelClass }>{ this.props.label }</label>
                <div className={ this.props.fieldClass }>
                    <textarea
                        id={ this.props.name }
                        name={ this.props.name }
                        ref={ this.props.name }
                        rows={ this.props.rows }
                        className='form-control'
                        placeholder={ this.props.placeholder }
                        value={ this.props.value }
                        onChange={ this.props.onChange }
                        onBlur={ this.props.onBlur }
                        { ...this.props.validationAttributes } />
                    <span className='text-danger' data-valmsg-replace='true' data-valmsg-for={ this.props.name } />
                </div>
                { this.props.children }
            </div>
        );
    }
}

TextArea.displayName = 'TextArea';
TextArea.propTypes = {
    children: PropTypes.object,
    fieldClass: PropTypes.string,
    label: PropTypes.string,
    labelClass: PropTypes.string,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    rows: PropTypes.string,
    validationAttributes: PropTypes.object,
    value: PropTypes.string
};

export default TextArea;
