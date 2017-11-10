import React from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';

import Messages from './Messages.jsx';

class GameChat extends React.Component {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.state = {
            canScroll: true,
            message: ''
        };
    }

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messagePanel).scrollTop(999999);
        }
    }

    onScroll() {
        let messages = this.refs.messagePanel;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.onSendChat(this.state.message);

        this.setState({ message: '' });
    }

    render() {
        return (
            <div className='chat'>
                <div className='messages panel' ref='messagePanel' onScroll={ this.onScroll }>
                    <Messages messages={ this.props.messages } onCardMouseOver={ this.props.onCardMouseOver } onCardMouseOut={ this.props.onCardMouseOut } />
                </div>
                <form>
                    <input className='form-control' placeholder='Chat...' onKeyPress={ this.onKeyPress } onChange={ this.onChange }
                        value={ this.state.message } />
                </form>
            </div>);
    }
}

GameChat.displayName = 'GameChat';
GameChat.propTypes = {
    messages: PropTypes.array,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onSendChat: PropTypes.func
};

export default GameChat;
