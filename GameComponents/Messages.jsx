import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';

import Avatar from '../Avatar.jsx';
import * as actions from '../actions';

class InnerMessages extends React.Component {
    constructor() {
        super();

        this.state = {
            message: ''
        };

        this.icons = [
            'military',
            'power',
            'intrigue',
            'stark',
            'baratheon',
            'tyrell',
            'martell',
            'lannister',
            'thenightswatch',
            'targaryen',
            'greyjoy'
        ];

        this.formatMessageText = this.formatMessageText.bind(this);
    }

    getMessage() {
        var index = 0;
        var messages = _.map(this.props.messages, message => {
            return <div key={ 'message' + index++ } className='message'>{ this.formatMessageText(message.message) }</div>;
        });

        return messages;
    }

    formatMessageText(message) {
        var index = 0;
        return _.map(message, (fragment, key) => {
            if(_.isNull(fragment) || _.isUndefined(fragment)) {
                return '';
            }

            if(key === 'alert') {
                let message = this.formatMessageText(fragment.message);

                switch(fragment.type) {
                    case 'endofround':
                        return (
                            <div className='seperator'>
                                <hr />
                                { message }
                                <hr />
                            </div>
                        );
                    case 'success':
                        return (<div className='alert alert-success'>
                            <span className='glyphicon glyphicon-ok-sign' />&nbsp;
                            { message }
                        </div>);
                    case 'info':
                        return (<div className='alert alert-info'>
                            <span className='glyphicon glyphicon-info-sign' />&nbsp;
                            { message }
                        </div>);
                    case 'danger':
                        return (<div className='alert alert-danger'>
                            <span className='glyphicon glyphicon-exclamation-sign' />&nbsp;
                            { message }
                        </div>);
                    case 'warning':
                        return (<div className='alert alert-warning'>
                            <span className='glyphicon glyphicon-warning-sign' />&nbsp;
                            { message }
                        </div>);
                }
                return message;
            } else if(fragment.message) {
                return this.formatMessageText(fragment.message);
            } else if(fragment.code && fragment.label) {
                return (
                    <span key={ index++ }
                        className='card-link'
                        onMouseOver={ this.props.onCardMouseOver.bind(this, fragment) }
                        onMouseOut={ this.props.onCardMouseOut.bind(this) }>
                        { fragment.label }
                    </span>
                );
            } else if(fragment.name) {
                return (
                    <div key={ index++ }>
                        <Avatar emailHash={ fragment.emailHash } forceDefault={ fragment.noAvatar } float />
                        <span key={ index++ }>
                            <b>{ fragment.name }</b>
                        </span>
                    </div>
                );
            } else if(_.contains(this.icons, fragment)) {
                return (
                    <span className={ 'icon-' + fragment } key={ index++ } />
                );
            }

            return fragment;
        });
    }

    render() {
        return <div>{ this.getMessage() }</div>;
    }
}

InnerMessages.displayName = 'Messages';
InnerMessages.propTypes = {
    messages: PropTypes.array,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    socket: PropTypes.object
};

function mapStateToProps(state) {
    return {
        socket: state.lobby.socket
    };
}

const Messages = connect(mapStateToProps, actions)(InnerMessages);

export default Messages;

