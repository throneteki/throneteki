import React from 'react';

const RadioButton = ({ name, onClick, selected, label }) => {
    return (
        <label className='radio-inline'>
            <input name={name} type='radio' onClick={onClick} checked={!!selected} />
            {label}
        </label>
    );
};

export default RadioButton;
