import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';

import * as actions from '../actions';

class InnerMessages extends React.Component {
    constructor() {
        super();

        this.onKeyPress = this.onKeyPress.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            message: ''
        };

        this.formatMessageText = this.formatMessageText.bind(this);
    }

    getMessage() {
        var index = 0;
        var messages = _.map(this.props.messages, message => {
            return <div key={'message'+index++} className='message'>{this.formatMessageText(message.message)}</div>;
        });

        return messages;
    }

    formatMessageText(message) {
        var index = 0;
        return _.map(message, fragment => {
            if(fragment.code && fragment.label) {
                return (
                    <span key={index++}
                        className='card-link'
                        onMouseOver={this.props.onCardMouseOver.bind(this, fragment)}
                        onMouseOut={this.props.onCardMouseOut.bind(this)}>
                        {fragment.label}
                    </span>
                );
            } else if(fragment.name) {
                return (
                    <span key={index++}>
                        {fragment.name}
                    </span>
                );
            }

            return fragment;
        });
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.socket.emit('chat', this.state.message);

        this.setState({ message: '' });
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

    render() {
        return <div>{this.getMessage()}</div>;
    }
}

InnerMessages.displayName = 'Messages';
InnerMessages.propTypes = {
    messages: React.PropTypes.array,
    onCardMouseOut: React.PropTypes.func,
    onCardMouseOver: React.PropTypes.func,
    socket: React.PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.socket.socket
    };
}

const Messages = connect(mapStateToProps, actions)(InnerMessages);

export default Messages;

