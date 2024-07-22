import React, { useCallback, useEffect, useState } from 'react';
import RadioButton from './RadioButton';

const RadioGroup = ({ buttons, onValueSelected, value }) => {
    const [selectedButton, setSelectedButton] = useState(value);

    useEffect(() => {
        setSelectedButton(value);
    }, [value]);

    const onRadioButtonClick = useCallback(
        (button) => {
            setSelectedButton(button.value);

            if (onValueSelected) {
                onValueSelected(button.value);
            }
        },
        [onValueSelected]
    );

    const isButtonSelected = useCallback(
        (button) => {
            if (!button || !selectedButton) {
                return false;
            }

            return selectedButton === button.value;
        },
        [selectedButton]
    );

    let buttonsRender = buttons.map((button) => {
        return (
            <RadioButton
                key={button.value}
                name={button.value}
                label={button.label}
                onClick={() => onRadioButtonClick(button)}
                selected={isButtonSelected(button)}
            />
        );
    });

    return <div>{buttonsRender}</div>;
};

export default RadioGroup;
