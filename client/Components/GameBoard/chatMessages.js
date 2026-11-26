// A message a player or spectator typed, rather than one the game logged: the server starts it with the
// sender's avatar
export const isChatMessage = (message) =>
    Object.values(message?.message ?? {}).some(
        (fragment) => fragment?.name && fragment.argType === 'player'
    );
