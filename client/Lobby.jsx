import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import moment from 'moment';

import * as actions from './actions';
import Avatar from './Avatar.jsx';
import News from './SiteComponents/News.jsx';
import AlertPanel from './SiteComponents/AlertPanel.jsx';

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

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onScroll() {
        var messages = this.refs.messages;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
    }

    render() {
        var index = 0;
        var messages = _.map(this.props.messages, message => {
            if(!message.user) {
                return;
            }

            var timestamp = moment(message.time).format('MMM Do H:mm:ss');
            return (
                <div key={ timestamp + message.user.username + (index++).toString() }>
                    <Avatar emailHash={ message.user.emailHash } float forceDefault={ message.user.noAvatar } />
                    <span className='username'>{ message.user.username }</span><span>{ timestamp }</span>
                    <div className='message'>{ message.message }</div>
                </div>);
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
                        <form className='form form-hozitontal'>
                            <div className='form-group'>
                                <div className='chat-box'>
                                    <input className='form-control' type='text' placeholder='Enter a message...' value={ this.state.message }
                                        onKeyPress={ this.onKeyPress } onChange={ this.onChange }
                                        ref={ input => input && input.focus() } />
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
