import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { accountLoggedIn } from '../reducers/auth';
import { sendAuthenticateMessage } from '../reducers/lobby';
import { navigate } from '../reducers/navigation';

const TagTypes = {
    Card: 'Card',
    News: 'News',
    Deck: 'Deck',
    Event: 'Event',
    RestrictedList: 'RestrictedList',
    Pack: 'Pack',
    Faction: 'Faction',
    Session: 'Session',
    BlockList: 'BlockList',
    User: 'User',
    BanList: 'BanList',
    AbuseBlock: 'AbuseBlock',
    DraftCube: 'DraftCube'
};

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
        headers.set('authorization', `Bearer ${getState().auth.token}`);

        return headers;
    },
    paramsSerializer: (params) => {
        const queryStr = new URLSearchParams();

        for (const param in params) {
            if (!Array.isArray(params[param])) {
                if (params[param]) {
                    queryStr.append(param, params[param]);
                }
            } else {
                let index = 0;
                for (const arrayVal of params[param]) {
                    for (const arrayParam in arrayVal) {
                        if (arrayVal[arrayParam]) {
                            queryStr.append(
                                `${param}[${index}].${arrayParam}`,
                                arrayVal[arrayParam]
                            );
                        }
                    }

                    index++;
                }
            }
        }
        return queryStr.toString();
    }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.originalStatus === 401) {
        // try to get a new token
        const refreshResult = await baseQuery(
            {
                url: '/account/token',
                method: 'POST',
                body: { token: api.getState().auth.refreshToken }
            },
            api,
            extraOptions
        );

        if (refreshResult.data?.success) {
            api.dispatch(
                accountLoggedIn(
                    refreshResult.data.data.user,
                    refreshResult.data.data.token,
                    api.getState().auth.refreshToken
                )
            );

            api.dispatch(sendAuthenticateMessage(refreshResult.data.data.token));

            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(navigate('/login'));
        }
    } else if (!result.error && !result?.data.success) {
        return {
            error: result.data.message || 'An unknown error occured. Please try again later.'
        };
    }

    if (api.endpoint === 'getDecks' || api.endpoint === 'getAllNews') {
        return result;
    }

    if (result.data) {
        return { data: result.data.data, success: result.data.success };
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: Object.values(TagTypes),
    endpoints: (builder) => ({
        getNews: builder.query({
            query: () => ({
                url: '/news'
            }),
            providesTags: (result = { data: [] }) => [
                TagTypes.News,
                ...(result.data || []).map(({ id }) => ({ type: TagTypes.News, id }))
            ]
        }),
        getAllNews: builder.query({
            query: () => ({
                url: '/news/all'
            }),
            providesTags: (result = { data: [] }) => [
                TagTypes.News,
                ...(result.data || []).map(({ id }) => ({ type: TagTypes.News, id }))
            ]
        }),
        verifyAuthentication: builder.query({
            query: () => ({ url: '/account/checkauth', method: 'POST' })
        }),
        loginAccount: builder.mutation({
            query: ({ username, password }) => ({
                url: `/account/login`,
                method: 'POST',
                body: { username: username, password: password }
            })
        }),
        getStandaloneDecks: builder.query({
            query: (loadOptions) => {
                return {
                    url: '/standalone-decks',
                    params: {
                        pageSize: loadOptions.pageSize,
                        pageNumber: loadOptions.pageIndex,
                        sorting: loadOptions.sorting,
                        filters: loadOptions.columnFilters
                    }
                };
            },
            providesTags: (result = { data: [] }) => [
                TagTypes.Deck,
                ...(result.data || [].map(({ _id }) => ({ type: TagTypes.Deck, _id })))
            ]
        }),
        getDecks: builder.query({
            query: (loadOptions) => {
                return {
                    url: '/decks',
                    params: {
                        pageSize: loadOptions.pageSize,
                        pageNumber: loadOptions.pageIndex,
                        sorting: loadOptions.sorting,
                        filters: loadOptions.columnFilters
                    }
                };
            },
            providesTags: (result = { data: [] }) => [
                TagTypes.Deck,
                ...result.data.map(({ _id }) => ({ type: TagTypes.Deck, _id }))
            ]
        }),
        getCards: builder.query({
            query: () => '/cards',
            providesTags: (result = { data: [] }) => [
                TagTypes.Card,
                ...(result.data || [].map(({ code }) => ({ type: TagTypes.Card, code })))
            ]
        }),
        getRestrictedList: builder.query({
            query: () => '/restricted-list',
            providesTags: (result = { data: [] }) => [
                TagTypes.RestrictedList,
                ...(result.data || [].map(({ code }) => ({ type: TagTypes.RestrictedList, code })))
            ]
        }),
        getEvents: builder.query({
            query: () => '/events',
            providesTags: (result = { data: [] }) => [
                TagTypes.Event,
                ...(result.data || [].map(({ _id }) => ({ type: TagTypes.Event, _id })))
            ]
        }),
        getPacks: builder.query({
            query: () => '/packs',
            providesTags: (result = { data: [] }) => [
                TagTypes.Pack,
                ...(result.data || [].map(({ code }) => ({ type: TagTypes.Pack, code })))
            ]
        }),
        addDeck: builder.mutation({
            query: (deck) => ({
                url: '/decks/',
                method: 'POST',
                body: deck
            }),
            invalidatesTags: [TagTypes.Deck]
        }),
        deleteDeck: builder.mutation({
            query: (deckId) => ({
                url: `/decks/${deckId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [TagTypes.Deck]
        }),
        deleteDecks: builder.mutation({
            query: (deckIds) => ({
                url: '/decks',
                method: 'DELETE',
                body: {
                    deckIds: deckIds
                }
            }),
            invalidatesTags: [TagTypes.Deck]
        }),
        getDeck: builder.query({
            query: (deckId) => {
                return {
                    url: `/decks/${deckId}`
                };
            },
            providesTags: (_result, _error, arg) => [{ type: TagTypes.Deck, _id: arg }]
        }),
        saveDeck: builder.mutation({
            query: (deck) => ({
                url: `/decks/${deck._id}`,
                method: 'PUT',
                body: deck
            }),
            invalidatesTags: (result, error, arg) => [{ type: TagTypes.Deck, _id: arg._id }]
        }),
        toggleDeckFavourite: builder.mutation({
            query: (deckId) => ({
                url: `/decks/${deckId}/toggleFavourite`,
                method: 'POST'
            }),
            invalidatesTags: (result, error, arg) => [{ type: TagTypes.Deck, _id: arg._id }]
        }),
        saveProfile: builder.mutation({
            query: ({ username, profile }) => ({
                url: `/account/${username}`,
                method: 'PUT',
                body: profile
            })
        }),
        updateAvatar: builder.mutation({
            query: (userId) => ({
                url: `/account/${userId}/updateavatar`,
                method: 'POST'
            })
        }),
        unlinkPatreon: builder.mutation({
            query: () => ({
                url: '/account/unlinkPatreon',
                method: 'POST'
            })
        }),
        getUserSessions: builder.query({
            query: (username) => `/account/${username}/sessions`,
            providesTags: (result = { data: [] }) => [
                TagTypes.Session,
                ...(result.data || []).map(({ id }) => ({ type: TagTypes.Session, id }))
            ]
        }),
        removeSession: builder.mutation({
            query: ({ username, sessionId }) => ({
                url: `/account/${username}/sessions/${sessionId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [TagTypes.Session]
        }),
        getBlockList: builder.query({
            query: (username) => `/account/${username}/blocklist`,
            providesTags: (result = { data: [] }) => [
                TagTypes.BlockList,
                ...(result.data || []).map(({ id }) => ({ type: TagTypes.BlockList, id }))
            ]
        }),
        addBlockListEntry: builder.mutation({
            query: ({ username, blockedUsername }) => ({
                url: `/account/${username}/blocklist`,
                method: 'POST',
                body: { username: blockedUsername }
            }),
            invalidatesTags: [TagTypes.BlockList]
        }),
        removeBlockListEntry: builder.mutation({
            query: ({ username, blockedUsername }) => ({
                url: `/account/${username}/blocklist/${blockedUsername}`,
                method: 'DELETE'
            }),
            invalidatesTags: [TagTypes.BlockList]
        }),
        logoutAccount: builder.mutation({
            query: (tokenId) => ({
                url: '/account/logout',
                method: 'POST',
                body: { tokenId: tokenId }
            })
        }),
        getUser: builder.query({
            query: (username) => `/user/${username}`,
            providesTags: (result = { data: [] }) => [
                TagTypes.User,
                ...(result.data || []).map(({ id }) => ({ type: TagTypes.User, id }))
            ]
        }),
        getUserAbuseProfile: builder.query({
            query: (username) => `/user/${username}/abuse-profile`,
            providesTags: (_result, _error, arg) => [{ type: TagTypes.User, id: `${arg}-abuse` }]
        }),
        saveUser: builder.mutation({
            query: (user) => ({
                url: `/user/${user.username}`,
                method: 'PUT',
                body: user
            }),
            invalidatesTags: (result, error, arg) => [{ type: TagTypes.User, id: arg.id }]
        }),
        restrictUser: builder.mutation({
            query: ({ username, days = 7, reason }) => ({
                url: `/user/${username}/restrict`,
                method: 'POST',
                body: { days, reason }
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: TagTypes.User, id: `${arg.username}-abuse` },
                TagTypes.User
            ]
        }),
        unrestrictUser: builder.mutation({
            query: ({ username, reason }) => ({
                url: `/user/${username}/unrestrict`,
                method: 'POST',
                body: { reason }
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: TagTypes.User, id: `${arg.username}-abuse` },
                TagTypes.User
            ]
        }),
        blockUserCluster: builder.mutation({
            query: ({ username, reason }) => ({
                url: `/user/${username}/block-cluster`,
                method: 'POST',
                body: { reason }
            }),
            invalidatesTags: (_result, _error, arg) => [
                TagTypes.AbuseBlock,
                { type: TagTypes.User, id: `${arg.username}-abuse` },
                TagTypes.User
            ]
        }),
        addNews: builder.mutation({
            query: (newsText) => ({
                url: '/news',
                method: 'POST',
                body: { text: newsText }
            }),
            invalidatesTags: [TagTypes.News]
        }),
        deleteNews: builder.mutation({
            query: (id) => ({
                url: `/news/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [TagTypes.News]
        }),
        saveNews: builder.mutation({
            query: ({ id, text }) => ({
                url: `/news/${id}`,
                method: 'PUT',
                body: { text }
            }),
            invalidatesTags: [TagTypes.News]
        }),
        getBanList: builder.query({
            query: () => '/banlist',
            providesTags: (result = { data: [] }) => [
                TagTypes.BanList,
                ...(result.data || []).map(({ id }) => ({ type: TagTypes.BanList, id }))
            ]
        }),
        addBanListEntry: builder.mutation({
            query: (ip) => ({
                url: '/banlist',
                method: 'POST',
                body: { ip: ip }
            }),
            invalidatesTags: [TagTypes.BanList]
        }),
        removeBanListEntry: builder.mutation({
            query: (id) => ({
                url: `/banlist/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [TagTypes.BanList]
        }),
        getAbuseBlocks: builder.query({
            query: () => '/abuse-blocks',
            providesTags: (result = { data: [] }) => [
                TagTypes.AbuseBlock,
                ...(result.data || []).map(({ _id }) => ({ type: TagTypes.AbuseBlock, _id }))
            ]
        }),
        addAbuseBlock: builder.mutation({
            query: (block) => ({
                url: '/abuse-blocks',
                method: 'POST',
                body: block
            }),
            invalidatesTags: [TagTypes.AbuseBlock]
        }),
        removeAbuseBlock: builder.mutation({
            query: (id) => ({
                url: `/abuse-blocks/${id}`,
                method: 'DELETE'
            }),
            invalidatesTags: [TagTypes.AbuseBlock]
        }),
        saveEvent: builder.mutation({
            query: (event) => ({
                url: `/events/${event._id || ''}`,
                method: event._id ? 'PUT' : 'POST',
                body: event
            }),
            invalidatesTags: (result, error, arg) => [{ type: TagTypes.Event, id: arg.id }]
        }),
        getEvent: builder.query({
            query: (eventId) => {
                return {
                    url: `/events/${eventId}`
                };
            },
            providesTags: (_result, _error, arg) => [{ type: TagTypes.Event, id: arg }]
        }),
        deleteEvent: builder.mutation({
            query: (eventId) => ({
                url: `/events/${eventId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [TagTypes.Event]
        }),
        registerAccount: builder.mutation({
            query: (account) => ({
                url: '/account/register',
                method: 'POST',
                body: account
            })
        }),
        preflightRegister: builder.mutation({
            query: (details) => ({
                url: '/account/preflight-register',
                method: 'POST',
                body: details
            })
        }),
        activateAccount: builder.mutation({
            query: (details) => ({
                url: '/account/activate',
                method: 'POST',
                body: details
            })
        }),
        forgotPassword: builder.mutation({
            query: (details) => ({
                url: '/account/password-reset',
                method: 'POST',
                body: details
            })
        }),
        resetPassword: builder.mutation({
            query: (details) => ({
                url: '/account/password-reset-finish',
                method: 'POST',
                body: details
            })
        }),
        linkPatreon: builder.mutation({
            query: (code) => ({
                url: '/account/linkPatreon',
                method: 'POST',
                body: { code }
            })
        }),
        removeMessage: builder.mutation({
            query: (messageId) => ({
                url: `/messages/${messageId}`,
                method: 'DELETE'
            })
        })
    })
});

export const {
    useGetNewsQuery,
    useGetAllNewsQuery,
    useGetDecksQuery,
    useGetCardsQuery,
    useGetRestrictedListQuery,
    useGetEventsQuery,
    useGetStandaloneDecksQuery,
    useVerifyAuthenticationQuery,
    useLoginAccountMutation,
    useGetPacksQuery,
    useAddDeckMutation,
    useDeleteDeckMutation,
    useGetDeckQuery,
    useSaveDeckMutation,
    useToggleDeckFavouriteMutation,
    useSaveProfileMutation,
    useUpdateAvatarMutation,
    useUnlinkPatreonMutation,
    useGetUserSessionsQuery,
    useRemoveSessionMutation,
    useGetBlockListQuery,
    useAddBlockListEntryMutation,
    useRemoveBlockListEntryMutation,
    useLogoutAccountMutation,
    useGetUserQuery,
    useGetUserAbuseProfileQuery,
    useSaveUserMutation,
    useRestrictUserMutation,
    useUnrestrictUserMutation,
    useBlockUserClusterMutation,
    useAddNewsMutation,
    useDeleteNewsMutation,
    useSaveNewsMutation,
    useGetBanListQuery,
    useAddBanListEntryMutation,
    useRemoveBanListEntryMutation,
    useGetAbuseBlocksQuery,
    useAddAbuseBlockMutation,
    useRemoveAbuseBlockMutation,
    useSaveEventMutation,
    useGetEventQuery,
    useDeleteEventMutation,
    useRegisterAccountMutation,
    usePreflightRegisterMutation,
    useActivateAccountMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLinkPatreonMutation,
    useRemoveMessageMutation,
    useDeleteDecksMutation
} = apiSlice;
