import React from 'react';
import PropTypes from 'prop-types';

class DraftPlayerPrompt extends React.Component {
    onButtonClick(event, button) {
        event.preventDefault();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(button);
        }
    }

    onMouseOver(event, card) {
        if(card && this.props.onMouseOver) {
            this.props.onMouseOver(card);
        }
    }

    onMouseOut(event, card) {
        if(card && this.props.onMouseOut) {
            this.props.onMouseOut(card);
        }
    }

    getButtons() {
        let buttonIndex = 0;

        let buttons = [];

        if(!this.props.buttons) {
            return null;
        }

        for(const button of this.props.buttons) {
            if(button.timer) {
                continue;
            }

            let option = (
                <button key={ button.command + buttonIndex.toString() }
                    className='btn btn-default prompt-button'
                    onClick={ event => this.onButtonClick(event, button) }
                    onMouseOver={ event => this.onMouseOver(event, button.card) }
                    onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }> { button.icon && <div className={ `with-background thronesicon thronesicon-${button.icon}` } /> } { button.text }</button>);

            buttonIndex++;

            buttons.push(option);
        }

        return buttons;
    }

    render() {
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        let promptText = [];
        if(this.props.promptText && this.props.promptText.includes('\n')) {
            let split = this.props.promptText.split('\n');
            for(let token of split) {
                promptText.push(token);
                promptText.push(<br />);
            }
        } else {
            promptText.push(this.props.promptText);
        }

        return (<div>
            { promptTitle }
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{ promptText }</h4>
                    { this.getButtons() }
                </div>
            </div>
        </div>);
    }
}

DraftPlayerPrompt.displayName = 'DraftPlayerPrompt';
DraftPlayerPrompt.propTypes = {
    buttons: PropTypes.array,
    onButtonClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onTitleClick: PropTypes.func,
    promptText: PropTypes.string,
    promptTitle: PropTypes.string,
    socket: PropTypes.object,
    user: PropTypes.object
};

export default DraftPlayerPrompt;
