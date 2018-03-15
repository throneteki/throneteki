import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { connect } from 'react-redux';

import Link from './Link.jsx';
import Avatar from './Avatar.jsx';

import * as actions from './actions';

class InnerNavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onMenuItemMouseOver(menuItem) {
        this.setState({
            showPopup : menuItem
        });
    }

    onMenuItemMouseOut() {
        this.setState({
            showPopup: undefined
        });
    }

    renderMenuItem(menuItem) {

        if(menuItem.childItems) {
            let className = 'dropdown';

            if(_.any(menuItem.childItems, item => {
                return item.path === this.props.currentPath;
            })) {
                className += ' active';
            }

            let childItems = _.map(menuItem.childItems, item => {
                return <li key={ item.name }><Link href={ item.path }>{ item.name }</Link></li>;
            });

            return (
                <li key={ menuItem.name } className={ className }>
                    <a href='#' className='dropdown-toggle' data-toggle='dropdown' role='button' aria-haspopup='true' aria-expanded='false'>{ menuItem.avatar ? <Avatar emailHash={ menuItem.emailHash } forceDefault={ menuItem.disableGravatar } /> : null }{ menuItem.name }<span className='caret' /></a>
                    <ul className='dropdown-menu'>
                        { childItems }
                    </ul>
                </li>);

        }

        let active = menuItem.path === this.props.currentPath ? 'active' : '';

        return <li key={ menuItem.name } className={ active }><Link href={ menuItem.path }>{ menuItem.name }</Link></li>;
    }

    render() {
        let leftMenuToRender = _.map(this.props.leftMenu, this.renderMenuItem.bind(this));
        let rightMenuToRender = _.map(this.props.rightMenu, this.renderMenuItem.bind(this));

        let numGames = !_.isUndefined(this.props.numGames) ? <li><span>{ this.props.numGames + ' Games' }</span></li> : null;

        let contextMenu = _.map(this.props.context, menuItem => {
            return (
                <li key={ menuItem.text }><a href='javascript:void(0)' onMouseOver={ this.onMenuItemMouseOver.bind(this, menuItem) }
                    onMouseOut={ this.onMenuItemMouseOut.bind(this) }
                    onClick={ menuItem.onClick ? event => {
                        event.preventDefault();
                        menuItem.onClick();
                    } : null }>{ menuItem.text }</a>{ (this.state.showPopup === menuItem) ? this.state.showPopup.popup : null }</li>
            );
        });

        let className = 'glyphicon glyphicon-signal';
        let toolTip = 'Lobby is';

        if(this.props.lobbySocketConnected) {
            className += ' text-success';
            toolTip += ' connected';
        } else if(this.props.lobbySocketConnecting) {
            className += ' text-primary';
            toolTip += ' connecting';
        } else {
            className += ' text-danger';
            toolTip += ' disconnected';
        }

        let lobbyStatus = (
            <li>
                <span className={ className } title={ toolTip } />
            </li>);

        className = 'glyphicon glyphicon-signal';
        toolTip = 'Game server is';
        if(this.props.currentGame) {
            if(this.props.gameConnected) {
                className += ' text-success';
                toolTip += ' connected';
            } else if(this.props.gameConnecting) {
                className += ' text-primary';
                toolTip += ' connecting';
            } else {
                className += ' text-danger';
                toolTip += ' disconnected';
            }
        } else {
            toolTip += ' not needed at this time';
        }

        let gameStatus = (
            <li>
                <span className={ className } title={ toolTip } />
            </li>);

        return (
            <nav className='navbar navbar-inverse navbar-fixed-top'>
                <div className='container'>
                    <div className='navbar-header'>
                        <button className='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='#navbar' aria-expanded='false' aria-controls='navbar'>
                            <span className='sr-only'>Toggle Navigation</span>
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                            <span className='icon-bar' />
                        </button>
                        <Link href='/' className='navbar-brand'>{ this.props.title }</Link>
                    </div>
                    <div id='navbar' className='collapse navbar-collapse'>
                        <ul className='nav navbar-nav'>
                            { leftMenuToRender }
                        </ul>
                        <ul className='nav navbar-nav navbar-right'>
                            { contextMenu }
                            { numGames }
                            { lobbyStatus }
                            { gameStatus }
                            { rightMenuToRender }
                        </ul>
                    </div>
                </div>
            </nav>);
    }
}

InnerNavBar.displayName = 'Decks';
InnerNavBar.propTypes = {
    context: PropTypes.array,
    currentGame: PropTypes.object,
    currentPath: PropTypes.string,
    gameConnected: PropTypes.bool,
    gameConnecting: PropTypes.bool,
    leftMenu: PropTypes.array,
    lobbySocketConnected: PropTypes.bool,
    lobbySocketConnecting: PropTypes.bool,
    numGames: PropTypes.number,
    rightMenu: PropTypes.array,
    title: PropTypes.string
};

function mapStateToProps(state) {
    return {
        context: state.navigation.context,
        currentGame: state.lobby.currentGame,
        gameConnected: state.games.connected,
        gameConnecting: state.games.connecting,
        lobbySocketConnected: state.lobby.connected,
        lobbySocketConnecting: state.lobby.connecting
    };
}

const NavBar = connect(mapStateToProps, actions)(InnerNavBar);

export default NavBar;

