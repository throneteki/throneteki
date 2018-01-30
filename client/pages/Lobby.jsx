import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import News from '../SiteComponents/News';
import AlertPanel from '../SiteComponents/AlertPanel';
import Panel from '../SiteComponents/Panel';
import Typeahead from '../FormComponents/Typeahead';
import SideBar from '../SideBar';
import UserList from '../UserList';
import LobbyChat from '../LobbyChat';

import * as actions from '../actions';

class InnerLobby extends React.Component {
    constructor() {
        super();

        this.onChange = this.onChange.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);

        this.state = {
            message: ''
        };
    }

    componentDidMount() {
        this.props.loadNews({ limit: 3 });
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

    render() {
        let isLoggedIn = !!this.props.username;
        let placeholder = isLoggedIn ? 'Enter a message...' : 'You must be logged in to send lobby chat messages';

        return (
            <div className='flex-container'>
                <SideBar>
                    <UserList users={ this.props.users } />
                </SideBar>
                <div className='col-sm-offset-1 col-sm-10'>
                    <div className='main-header'>
                        <span className='text-center'><h1>A # LCG second edition</h1></span>
                    </div>
                </div>
                { this.props.bannerNotice ? <div className='col-sm-offset-1 col-sm-10 announcement'>
                    <AlertPanel message={ this.props.bannerNotice } type='error' />
                </div> : null }
                <div className='col-sm-offset-1 col-sm-10'>
                    <Panel title='Latest site news'>
                        { this.props.loading ? <div>News loading...</div> : null }
                        <News news={ this.props.news } />
                    </Panel>
                </div>
                <div className='col-sm-offset-1 col-sm-10 chat-container'>
                    <Panel title={ `Lobby Chat (${ this.props.users.length } online)` }>
                        <div>
                            <LobbyChat messages={ this.props.messages } />
                        </div>
                    </Panel>
                    <form className='form form-hozitontal chat-box-container' onSubmit={ event => this.onSendClick(event) }>
                        <div className='form-group'>
                            <div className='chat-box'>
                                <Typeahead disabled={ !isLoggedIn } ref='message' value={ this.state.message } placeholder={ placeholder }
                                    labelKey={ 'name' } onKeyDown={ this.onKeyPress }
                                    options={ this.props.users } onInputChange={ this.onChange } autoFocus
                                    dropup emptyLabel={ '' }
                                    minLength={ 2 } />
                            </div>
                        </div>
                    </form>
                </div>
            </div>);
    }
}

InnerLobby.displayName = 'Lobby';
InnerLobby.propTypes = {
    bannerNotice: PropTypes.string,
    fetchNews: PropTypes.func,
    loadNews: PropTypes.func,
    loading: PropTypes.bool,
    messages: PropTypes.array,
    news: PropTypes.array,
    socket: PropTypes.object,
    username: PropTypes.string,
    users: PropTypes.array
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.lobby.notice,
        loading: state.api.loading,
        messages: state.lobby.messages,
        news: state.news.news,
        newsLoading: state.news.newsLoading,
        socket: state.lobby.socket,
        username: state.auth.username,
        users: state.lobby.users
    };
}

const Lobby = connect(mapStateToProps, actions, null)(InnerLobby);

export default Lobby;
