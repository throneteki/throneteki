import React from 'react';

const DraftPlayerPrompt = ({
    buttons,
    onButtonClick,
    onMouseOver,
    onMouseOut,
    promptText,
    promptTitle
}) => {
    const handleButtonClick = (event, button) => {
        event.preventDefault();

        if (onButtonClick) {
            onButtonClick(button);
        }
    };

    const handleMouseOver = (event, card) => {
        if (card && onMouseOver) {
            onMouseOver(card);
        }
    };

    const handleMouseOut = (event, card) => {
        if (card && onMouseOut) {
            onMouseOut(card);
        }
    };

    const getButtons = () => {
        let buttonIndex = 0;
        let retButtons = [];

        if (!buttons) {
            return null;
        }

        for (const button of buttons) {
            if (button.timer) {
                continue;
            }

            let option = (
                <button
                    key={button.command + buttonIndex.toString()}
                    className='btn btn-default prompt-button'
                    onClick={(event) => handleButtonClick(event, button)}
                    onMouseOver={(event) => handleMouseOver(event, button.card)}
                    onMouseOut={(event) => handleMouseOut(event, button.card)}
                    disabled={button.disabled}
                >
                    {' '}
                    {button.icon && (
                        <div className={`with-background thronesicon thronesicon-${button.icon}`} />
                    )}{' '}
                    {button.text}
                </button>
            );

            buttonIndex++;

            retButtons.push(option);
        }

        return retButtons;
    };

    let promptTitleElement;
    if (promptTitle) {
        promptTitleElement = <div className='menu-pane-source'>{promptTitle}</div>;
    }

    let promptTextElements = [];
    if (promptText && promptText.includes('\n')) {
        let split = promptText.split('\n');
        for (let token of split) {
            promptTextElements.push(token);
            promptTextElements.push(<br />);
        }
    } else {
        promptTextElements.push(promptText);
    }

    return (
        <div>
            {promptTitleElement}
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{promptTextElements}</h4>
                    {getButtons()}
                </div>
            </div>
        </div>
    );
};

export default DraftPlayerPrompt;
