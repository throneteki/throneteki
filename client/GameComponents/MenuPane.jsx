import React from 'react';
import _ from 'underscore';

class MenuPane extends React.Component {
    constructor() {
        super();

        this.onButtonClick = this.onButtonClick.bind(this);

        this.timer = {};

        this.state = {
        };
    }

    componentWillReceiveProps(props) {
        if(_.any(props.buttons, button => {
            return button.timer;
        })) {
            if(this.timer.handle) {
                return;
            }

            this.timer.started = new Date();
            this.timer.timerTime = _.isUndefined(this.props.user.settings.windowTimer) ? 10 : this.props.user.settings.windowTimer;

            this.setState({ showTimer: true, timerClass: '100%' });

            this.timer.handle = setInterval(() => {
                let now = new Date();
                let difference = (now - this.timer.started) / 1000;
                let keepGoing = true;

                if(difference > this.timer.timerTime) {
                    clearInterval(this.timer.handle);
                    this.timer.handle = undefined;

                    keepGoing = false;
                }

                let timerClass = (((this.timer.timerTime - difference) / this.timer.timerTime) * 100) + '%';
                this.setState({ showTimer: keepGoing, timerClass: timerClass });
            }, 100);
        }
    }

    onButtonClick(event, command, arg, method) {
        event.preventDefault();

        if(this.props.onButtonClick) {
            this.props.onButtonClick(command, arg, method);
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

        _.each(this.props.buttons, button => {
            if(button.timer) {
                return;
            }

            let option = (
                <button key={ button.command + buttonIndex.toString() } className='btn btn-primary'
                    onClick={ event => this.onButtonClick(event, button.command, button.arg, button.method) }
                    onMouseOver={ event => this.onMouseOver(event, button.card) } onMouseOut={ event => this.onMouseOut(event, button.card) }
                    disabled={ button.disabled }>{ button.text }</button>);

            buttonIndex++;

            buttons.push(option);
        });

        return buttons;
    }

    render() {
        let promptTitle;

        if(this.props.promptTitle) {
            promptTitle = (<div className='menu-pane-source'>{ this.props.promptTitle }</div>);
        }

        let timer = null;

        if(this.state.showTimer) {
            timer = (<div className='progress'>
                <div className='progress-bar progress-bar-success progress-bar-striped' role='progressbar' style={ { width: this.state.timerClass } } />
            </div>);
        }

        return (<div>
            { timer }
            { promptTitle }
            <div className='menu-pane'>
                <div className='panel'>
                    <h4>{ this.props.title }</h4>
                    { this.getButtons() }
                </div>
            </div>
        </div>);
    }
}

MenuPane.displayName = 'MenuPane';
MenuPane.propTypes = {
    buttons: React.PropTypes.array,
    onButtonClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    promptTitle: React.PropTypes.string,
    socket: React.PropTypes.object,
    title: React.PropTypes.string,
    user: React.PropTypes.object
};

export default MenuPane;
