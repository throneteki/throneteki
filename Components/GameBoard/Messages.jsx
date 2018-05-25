import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Avatar from '../Site/Avatar';
import * as actions from '../../actions';

class Messages extends React.Component {
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
        var messages = this.props.messages.map(message => {
            return <div key={ 'message' + index++ } className='message'>{ this.formatMessageText(message.message) }</div>;
        });

        return messages;
    }

    formatMessageText(message) {
        let index = 0;

        let messages = [];

        for(const [key, fragment] of Object.entries(message)) {
            if(fragment === null || fragment === undefined) {
                messages.push('');

                continue;
            }

            if(key === 'alert') {
                let message = this.formatMessageText(fragment.message);

                switch(fragment.type) {
                    case 'endofround':
                        messages.push(
                            <div className='seperator' key={ index++ }>
                                <hr />
                                { message }
                                <hr />
                            </div>
                        );
                        break;
                    case 'success':
                        messages.push(<div className='alert alert-success' key={ index++ }>
                            <span className='glyphicon glyphicon-ok-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    case 'info':
                        messages.push(<div className='alert alert-info' key={ index++ }>
                            <span className='glyphicon glyphicon-info-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    case 'danger':
                        messages.push(<div className='alert alert-danger' key={ index++ }>
                            <span className='glyphicon glyphicon-exclamation-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    case 'warning':
                        messages.push(<div className='alert alert-warning' key={ index++ }>
                            <span className='glyphicon glyphicon-warning-sign' />&nbsp;
                            { message }
                        </div>);
                        break;
                    default:
                        messages.push(message);
                        break;
                }
            } else if(fragment.message) {
                messages.push(this.formatMessageText(fragment.message));
            } else if(fragment.code && fragment.label) {
                messages.push(
                    <span key={ index++ }
                        className='card-link'
                        onMouseOver={ this.props.onCardMouseOver.bind(this, fragment) }
                        onMouseOut={ this.props.onCardMouseOut.bind(this) }>
                        { fragment.label }
                    </span>
                );
            } else if(fragment.name) {
                messages.push(
                    <div key={ index++ }>
                        <Avatar username={ fragment.name } float />
                        <span key={ index++ }>
                            <b>{ fragment.name }</b>
                        </span>
                    </div>
                );
            } else if(this.icons.includes(fragment)) {
                messages.push(
                    <span className={ 'icon-' + fragment } key={ index++ } />
                );
            } else {
                messages.push(fragment);
            }
        }

        return messages;
    }

    render() {
        return <div>{ this.getMessage() }</div>;
    }
}

Messages.displayName = 'Messages';
Messages.propTypes = {
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

export default connect(mapStateToProps, actions)(Messages);

