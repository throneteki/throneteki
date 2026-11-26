/* eslint react/display-name: 0 react/no-multi-comp: 0 */

import React from 'react';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Decks from './pages/Decks';
import HowToPlay from './pages/HowToPlay';
import About from './pages/About';
import Activation from './pages/Activation';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserAdmin from './pages/UserAdmin';
import Profile from './pages/Profile';
import { isProfileSection } from './Components/Profile/ProfileSections';
import NewsAdmin from './pages/NewsAdmin';
import AddDeck from './Components/Decks/AddDeck';
import EditDeck from './Components/Decks/EditDeck';
import GameLobby from './Components/Games/GameLobby';
import GameBoard from './Components/GameBoard/GameBoard';
import Redirect from './Components/Site/Redirect';
import NodesAdmin from './pages/NodesAdmin';
import MotdAdmin from './pages/MotdAdmin';
import BannersAdmin from './pages/BannersAdmin';
import ProblemReportsAdmin from './pages/ProblemReportsAdmin';
import Privacy from './pages/Privacy';
import Patreon from './pages/Patreon';
import ThronesDb from './pages/ThronesDb';
import ThronesDbDecks from './pages/ThronesDbDecks';
import BanlistAdmin from './pages/BanlistAdmin';
import EventsAdmin from './pages/EventsAdmin';
import EventEditor from './pages/EventsAdmin/EventEditor';
import Stats from './pages/Stats';
import Unsubscribe from './pages/Unsubscribe';
import Wrapped from './pages/Wrapped';

const routes = [
    { path: '/', action: () => <Lobby key='lobby' /> },
    { path: '/about', action: () => <About key='about' /> },
    {
        path: '/activation',
        action: (context) => (
            <Activation key='activation' id={context.params.id} token={context.params.token} />
        )
    },
    { path: '/blocklist', action: () => <Redirect key='blocklist' to='/profile/blocklist' /> },
    { path: '/decks', action: () => <Decks key='decks' /> },
    { path: '/decks/new', action: () => <AddDeck key='adddecks' /> },
    { path: '/decks/thronesdb', action: () => <ThronesDbDecks key='thronesdbdecks' /> },
    {
        path: '/decks/edit/:id([a-f\\d]{24}|\\d+)',
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
                return <GameBoard key='gameboard' />;
            }

            return <GameLobby key='gamelobby' gameId={context.params.gameId} />;
        }
    },
    {
        path: '/profile/:section?',
        action: (context) =>
            (!context.params.section || isProfileSection(context.params.section)) && (
                <Profile key='profile' section={context.params.section} />
            )
    },
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
    { path: '/security', action: () => <Redirect key='security' to='/profile/sessions' /> },
    { path: '/stats', action: () => <Stats key='stats' /> },
    {
        path: '/unsubscribe',
        action: (context) => (
            <Unsubscribe key='unsubscribe' id={context.params.id} token={context.params.token} />
        )
    },
    {
        path: '/white-book/:year(\\d{4})',
        action: (context) => <Wrapped key='wrapped' year={context.params.year} />
    },
    { path: '/users', action: () => <UserAdmin key='useradmin' />, permission: 'canManageUsers' },
    { path: '/nodes', action: () => <NodesAdmin key='nodesadmin' />, permission: 'canManageNodes' },
    {
        path: '/admin/problem-reports',
        action: () => <ProblemReportsAdmin key='problemreports' />,
        permission: 'canManageProblemReports'
    },
    { path: '/privacy', action: () => <Privacy key='privacy' /> },
    {
        path: '/admin/motd',
        action: () => <MotdAdmin key='motdadmin' />,
        permission: 'canManageMotd'
    },
    {
        path: '/admin/banners',
        action: () => <BannersAdmin key='bannersadmin' />,
        permission: 'canManageBanners'
    },
    { path: '/patreon', action: (context) => <Patreon code={context.params.code} /> },
    { path: '/thronesdb', action: () => <ThronesDb key='thronesdb' /> },
    {
        path: '/banlist',
        action: () => <BanlistAdmin key='banlist' permission='canManageBanlist' />
    },
    { path: '/events', action: () => <EventsAdmin key='events' /> },
    { path: '/events/add', action: () => <EventEditor key='eventsadd' /> },
    {
        path: '/events/:id',
        action: (context) => <EventEditor eventId={context.params.id} key='eventsedit' />
    }
];

export default routes;
