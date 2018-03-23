/* eslint react/display-name: 0 react/no-multi-comp: 0 */

import React from 'react';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Decks from './pages/Decks';
import HowToPlay from './pages/HowToPlay';
import About from './pages/About';
import Security from './pages/Security';
import Activation from './pages/Activation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserAdmin from './pages/UserAdmin';
import Profile from './pages/Profile';
import NewsAdmin from './pages/NewsAdmin';
import AddDeck from './Components/Decks/AddDeck';
import EditDeck from './Components/Decks/EditDeck';
import GameLobby from './Components/Games/GameLobby';
import GameBoard from './Components/GameBoard/GameBoard';
import BlockList from './pages/BlockList';

const routes = [
    { path: '/', action: () => <Lobby /> },
    { path: '/about', action: () => <About /> },
    { path: '/activation', action: context => <Activation id={ context.params.id } token={ context.params.token } /> },
    { path: '/blocklist', action: () => <BlockList /> },
    { path: '/decks', action: () => <Decks /> },
    { path: '/decks/add', action: () => <AddDeck /> },
    { path: '/decks/edit/:id([a-f\\d]{24})', action: context => <EditDeck deckId={ context.params.id } /> },
    { path: '/forgot', action: () => <ForgotPassword /> },
    { path: '/how-to-play', action: () => <HowToPlay /> },
    { path: '/login', action: () => <Login /> },
    { path: '/logout', action: () => <Logout /> },
    { path: '/news', action: () => <NewsAdmin />, permission: 'canEditNews' },
    { path: '/play', action: context => (context.currentGame && context.currentGame.started) ? <GameBoard /> : <GameLobby /> },
    { path: '/profile', action: () => <Profile /> },
    { path: '/register', action: () => <Register /> },
    { path: '/reset-password', action: context => <ResetPassword id={ context.params.id } token={ context.params.token } /> },
    { path: '/security', action: () => <Security /> },
    { path: '/users', action: () => <UserAdmin />, permission: 'canManageUsers' }
];

export default routes;
