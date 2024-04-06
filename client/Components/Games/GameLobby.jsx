import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

import NewGame from './NewGame';
import GameList from './GameList';
import PendingGame from './PendingGame';
import PasswordGame from './PasswordGame';
import AlertPanel from '../Site/AlertPanel';
import Panel from '../Site/Panel';
import Checkbox from '../Form/Checkbox';

import * as actions from '../../actions';

const GameState = Object.freeze({
    None: 0,
    NewGame: 1,
    PendingGame: 2,
    PasswordedGame: 3,
    Started: 4
});

class GameLobby extends React.Component {
    constructor(props) {
        super(props);

        this.onNewGameClick = this.onNewGameClick.bind(this);
        this.onQuickJoinClick = this.onQuickJoinClick.bind(this);

        let savedFilter = localStorage.getItem('gameFilter');
        if(savedFilter) {
            savedFilter = JSON.parse(savedFilter);
        } else {
            savedFilter = {};
        }

        let filterDefaults = {
            beginner: true,
            casual: true,
            competitive: true,
            showOnlyNewGames: false
        };

        this.state = {
            gameState: GameState.None,
            filter: Object.assign(filterDefaults, savedFilter)
        };
    }

    componentDidMount() {
        if(window.Notification && Notification.permission !== 'granted') {
            Notification.requestPermission();
    }

    componentWillReceiveProps(props) {
        const { currentGame, gameId, games, joinPasswordGame, sendSocketMessage, setUrl } = props;

        if(!props.currentGame) {
            this.props.setContextMenu([]);
        }

        if(props.user) {
            this.setState({ errorMessage: undefined });
        }

        this.setGameState(props);

        if(!this.isPendingGameStillCurrent(props) || this.isGameInProgress(props)) {
            this.setState({ gameState: props.currentGame && props.currentGame.started ? GameState.Started : GameState.None });
        }

        if(props.currentGame && !this.props.currentGame && !props.currentGame.started) {
            // Joining a game
            this.setState({ gameState: GameState.PendingGame });
        } else if(!currentGame && gameId && games.length > 0) {
            const game = games.find((x) => x.id === gameId);

            if(!game) {
                toastr.error('Error', 'The game you tried to join was not found.');
            } else {
                if(!game.started && !game.full) {
                    if(game.needsPassword) {
                        joinPasswordGame(game, 'Join');
                    } else {
                        sendSocketMessage('joingame', gameId);
                    }
                } else {
                    if(game.needsPassword) {
                        joinPasswordGame(game, 'Watch');
                    } else {
                        sendSocketMessage('watchgame', game.id);
                    }
                }
            }
            setUrl('/play');
        }
    }

    setGameState(props) {
        if(props.passwordGame) {
            this.setState({ gameState: GameState.PasswordedGame });
        } else if(props.currentGame && !props.currentGame.started) {
            this.setState({ gameState: GameState.PendingGame });
        } else if(props.currentGame && props.currentGame.started) {
            this.setState({ gameState: GameState.Started });
        } else if(!props.currentGame && props.newGame && props.user) {
            this.setState({ gameState: GameState.NewGame });
        }
    }

    isPendingGameStillCurrent(props) {
        if(this.props.newGame && !props.newGame) {
            return false;
        }

        if(this.props.currentGame && !props.currentGame) {
            return false;
        }

        return true;
    }

    isGameInProgress(props) {
        if(props.currentGame && props.currentGame.started && (!this.props.currentGame || !this.props.currentGame.started)) {
            return true;
        }

        return false;
    }

    startNewGame() {
        if(!this.props.user) {
            this.setState({ errorMessage: 'Please login before trying to start a new game' });

            return;
        }

        this.props.startNewGame();
    }

    onNewGameClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: false });

        this.startNewGame();
    }

    onQuickJoinClick(event) {
        event.preventDefault();

        this.setState({ quickJoin: true });

        this.startNewGame();
    }

    onCheckboxChange(field, event) {
        let filter = Object.assign({}, this.state.filter);

        filter[field] = event.target.checked;

        this.setState({ filter: filter });

        localStorage.setItem('gameFilter', JSON.stringify(filter));
    }

    render() {
        let modalBody = null;

        switch(this.state.gameState) {
            case GameState.None:
            default:
                break;
            case GameState.NewGame:
                modalBody = <NewGame defaultGameName={ this.props.user.username + '\'s game' } quickJoin={ this.state.quickJoin } />;
                break;
            case GameState.PendingGame:
                modalBody = this.props.currentGame ? <PendingGame /> : null;
                break;
            case GameState.PasswordedGame:
                modalBody = <PasswordGame />;
                break;
        }

        return (
            <div className='full-height'>
                <div className='col-md-offset-2 col-md-8 full-height'>
                    { this.props.bannerNotice ? <AlertPanel type='error' message={ this.props.bannerNotice } /> : null }
                    { this.state.errorMessage ? <AlertPanel type='error' message={ this.state.errorMessage } /> : null }
                    { modalBody }
                    <Panel title='Current Games'>
                        <div className='col-xs-12 game-controls'>
                            <div className='col-xs-3 join-buttons'>
                                <button className='btn btn-primary' onClick={ this.onNewGameClick } disabled={ !!this.props.currentGame || !this.props.user }>New Game</button>
                                <button className='btn btn-primary' onClick={ this.onQuickJoinClick } disabled={ !!this.props.currentGame || !this.props.user }>Quick Join</button>                            </div>
                            <div className='col-xs-9 game-filter'>
                                <Panel type='tertiary'>
                                    <Checkbox name='beginner' label='Beginner' fieldClass='col-xs-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'beginner') } checked={ this.state.filter['beginner'] } />
                                    <Checkbox name='casual' label='Casual' fieldClass='col-xs-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'casual') } checked={ this.state.filter['casual'] } />
                                    <Checkbox name='competitive' label='Competitive' fieldClass='col-xs-4' noGroup onChange={ this.onCheckboxChange.bind(this, 'competitive') } checked={ this.state.filter['competitive'] } />
                                    <Checkbox name='showOnlyNewGames' label='Only show new games' fieldClass='col-xs-6' noGroup onChange={ this.onCheckboxChange.bind(this, 'showOnlyNewGames') } checked={ this.state.filter['showOnlyNewGames'] } />
                                </Panel>
                            </div>
                        </div>
                        <div className='col-xs-12'>
                            { this.props.games.length === 0 ? <AlertPanel type='info' message='No games are currently in progress.' /> : <GameList games={ this.props.games } gameFilter={ this.state.filter } /> }
                        </div>
                    </Panel>
                </div>
            </div>);
    }
}

GameLobby.displayName = 'GameLobby';
GameLobby.propTypes = {
    bannerNotice: PropTypes.string,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    gameId: PropTypes.string,
    games: PropTypes.array,
    joinPasswordGame: PropTypes.func,
    newGame: PropTypes.bool,
    passwordGame: PropTypes.object,
    sendSocketMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    setUrl: PropTypes.func,
    startNewGame: PropTypes.func,
    user: PropTypes.object
};

function mapStateToProps(state) {
    return {
        bannerNotice: state.lobby.notice,
        currentGame: state.lobby.currentGame,
        games: state.lobby.games,
        newGame: state.lobby.newGame,
        passwordGame: state.lobby.passwordGame,
        socket: state.lobby.socket,
        user: state.account.user
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

export default connect(mapStateToProps, mapDispatchToProps)(GameLobby);

