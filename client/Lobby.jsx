import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';

import * as actions from './actions';
import Avatar from './Avatar.jsx';
import News from './SiteComponents/News.jsx';
import AlertPanel from './SiteComponents/AlertPanel.jsx';
import Typeahead from './FormComponents/Typeahead.jsx';

class InnerLobby extends React.Component {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onScroll = this.onScroll.bind(this);

        this.state = {
            canScroll: true,
            message: ''
        };
    }

    componentDidMount() {
        this.props.loadNews({ limit: 3 });
    }

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messages).scrollTop(999999);
        }
    }

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.socket.emit('lobbychat', this.state.message);

        this.setState({ message: '' });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            this.refs.message.clear();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onChange(value) {
        this.setState({ message: value });
    }

    onScroll() {
        let messages = this.refs.messages;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    render() {
        let index = 0;
        let groupedMessages = _.groupBy(this.props.messages, message => message.user && message.user.username + moment(message.time).format('YYYYMMDDHHmm'));
        let today = moment();
        let yesterday = moment().add(-1, 'days');

        let messages = _.map(groupedMessages, messages => {
            let timestamp = '';
            let firstMessage = _.first(messages);

            if(!firstMessage.user) {
                return;
            }

            if(today.isSame(firstMessage.time, 'd')) {
                timestamp = moment(firstMessage.time).format('H:mm');
            } else if(yesterday.isSame(firstMessage.time, 'd')) {
                timestamp = moment(firstMessage.time).format('yesterday H:mm');
            } else {
                timestamp = moment(firstMessage.time).format('MMM Do H:mm');
            }

            let renderedMessages = _.map(messages, message => {
                if(!message.user) {
                    return;
                }
                return (<div className='message'>{ message.message }</div>);
            });

            return (
                <div key={ timestamp + firstMessage.user.username + (index++).toString() }>
                    <Avatar emailHash={ firstMessage.user.emailHash } float forceDefault={ firstMessage.user.noAvatar } />
                    <span className='username'>{ firstMessage.user.username }</span><span>{ timestamp }</span>
                    { renderedMessages }
                </div>
            );
        });

        return (
            <div className='body'>
                <div className='col-sm-offset-1 col-sm-10'>
                    <div className='main-header'>
                        <span className='text-center'><h1>A # LCG second edition</h1></span>
                    </div>
                </div>
                { this.props.bannerNotice ? <AlertPanel message={ this.props.bannerNotice } type='error' /> : null }
                <div className='col-sm-offset-1 col-sm-10'>
                    <div className='panel-title text-center'>
                        Latest site news
                    </div>
                    <div className='panel panel-darker'>
                        { this.props.loading ? <div>News loading...</div> : null }
                        <News news={ this.props.news } />
                    </div>
                </div>
                <div className='col-sm-offset-1 col-sm-10 chat-outer'>
                    <div className='chat-container'>
                        <div className='panel-title text-center'>
                            Lobby Chat ({ _.size(this.props.users) } online)
                        </div>
                        <div className='lobby-chat'>
                            <div className='panel lobby-messages' ref='messages' onScroll={ this.onScroll }>
                                { messages }
                            </div>
                        </div>
                        <form className='form form-hozitontal' onSubmit={ event => this.onSendClick(event) }>
                            <div className='form-group'>
                                <div className='chat-box'>
                                    <Typeahead ref='message' value={ this.state.message } placeholder='Enter a message...'
                                        labelKey={ 'name' } onKeyDown={ this.onKeyPress }
                                        options={ _.toArray(this.props.users) } onInputChange={ this.onChange } autoFocus
                                        dropup emptyLabel={ '' }
                                        minLength={ 2 } />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>);
    }
}

InnerLobby.displayName = 'Lobby';
InnerLobby.propTypes = {
    bannerNotice: React.PropTypes.string,
    fetchNews: React.PropTypes.func,
    loadNews: React.PropTypes.func,
    loading: React.PropTypes.bool,
    messages: React.PropTypes.array,
    news: React.PropTypes.array,
    socket: React.PropTypes.object,
    users: React.PropTypes.array
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.chat.notice,
        loading: state.api.loading,
        messages: state.chat.messages,
        news: state.news.news,
        newsLoading: state.news.newsLoading,
        socket: state.socket.socket,
        users: state.games.users
    };
}

const Lobby = connect(mapStateToProps, actions, null)(InnerLobby);

export default Lobby;
