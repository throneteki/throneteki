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
import GameBoardOld from './Components/GameBoard/GameBoard';
import BlockList from './pages/BlockList';
import NodesAdmin from './pages/NodesAdmin';
import MotdAdmin from './pages/MotdAdmin';
import Privacy from './pages/Privacy';
import Patreon from './pages/Patreon';
import BanlistAdmin from './pages/BanlistAdmin';
import EventsAdmin from './pages/EventsAdmin';
import EditEvent from './pages/EventsAdmin/EditEvent';
import EditDraftCube from './pages/EventsAdmin/EditDraftCube';
import DraftingTable from './Components/Drafting/DraftingTable';

const routes = [
    { path: '/', action: () => <Lobby key='lobby' /> },
    { path: '/about', action: () => <About key='about' /> },
    {
        path: '/activation',
        action: (context) => (
            <Activation key='activation' id={context.params.id} token={context.params.token} />
        )
    },
    { path: '/blocklist', action: () => <BlockList key='blocklist' /> },
    { path: '/decks', action: () => <Decks key='decks' /> },
    { path: '/decks/add', action: () => <AddDeck key='adddecks' /> },
    {
        path: '/decks/edit/:id([a-f\\d]{24})',
        action: (context) => <EditDeck key='editdeck' deckId={context.params.id} />
    },
    { path: '/forgot', action: () => <ForgotPassword key='forgotpassword' /> },
    { path: '/how-to-play', action: () => <HowToPlay key='howtoplay' /> },
    { path: '/login', action: () => <Login key='login' /> },
    { path: '/logout', action: () => <Logout key='logout' /> },
    { path: '/news', action: () => <NewsAdmin key='newsadmin' />, permission: 'canEditNews' },
    {
        path: '/play',
        action: (context) => {
            if (context.currentGame && context.currentGame.started) {
                if (context.currentGame.tableType === 'drafting-session') {
                    return <DraftingTable key='drafting-table' />;
                }

                return <GameBoardOld key='gameboard' />;
            }

            return <GameLobby key='gamelobby' gameId={context.params.gameId} />;
        }
    },
    { path: '/profile', action: () => <Profile key='profile' /> },
    { path: '/register', action: () => <Register key='register' /> },
    {
        path: '/reset-password',
        action: (context) => (
            <ResetPassword
                key='resetpassword'
                id={context.params.id}
                token={context.params.token}
            />
        )
    },
    { path: '/security', action: () => <Security key='security' /> },
    { path: '/users', action: () => <UserAdmin key='useradmin' />, permission: 'canManageUsers' },
    { path: '/nodes', action: () => <NodesAdmin key='nodesadmin' />, permission: 'canManageNodes' },
    { path: '/privacy', action: () => <Privacy key='privacy' /> },
    {
        path: '/admin/motd',
        action: () => <MotdAdmin key='motdadmin' />,
        permission: 'canManageMotd'
    },
    { path: '/patreon', action: (context) => <Patreon code={context.params.code} /> },
    {
        path: '/banlist',
        action: () => <BanlistAdmin key='banlist' permission='canManageBanlist' />
    },
    { path: '/events', action: () => <EventsAdmin key='events' /> },
    { path: '/events/add', action: () => <EditEvent key='eventsadd' /> },
    {
        path: '/events/:id',
        action: (context) => <EditEvent eventId={context.params.id} key='eventsedit' />
    },
    { path: '/events/draft-cubes/add', action: () => <EditDraftCube key='draftcubesadd' /> },
    {
        path: '/events/draft-cubes/:id',
        action: (context) => <EditDraftCube draftCubeId={context.params.id} key='draftcubesedit' />
    }
];

export default routes;
