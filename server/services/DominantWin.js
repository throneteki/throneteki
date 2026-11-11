// A dominant win is a win by 10 or more power over the highest-placed opponent, or a win some other way than
// reaching 15 power (concession, opponents eliminated, time) with 10+ power while every opponent has under 5.
// User stats use isDominantWin and Wrapped's rankings use DominantWinSql; the spec checks they agree.

export const MinPowerGap = 10;
export const MinPowerOtherWin = 10;
export const MaxOpponentPowerOtherWin = 4;

export function isDominantWin(game) {
    if (!game.won || !Number.isInteger(game.power)) {
        return false;
    }

    const opponentPower = Math.max(0, ...game.opponents.map((opponent) => opponent.power || 0));

    return (
        game.power - opponentPower >= MinPowerGap ||
        (game.win_reason !== 'power' &&
            game.power >= MinPowerOtherWin &&
            opponentPower <= MaxOpponentPowerOtherWin)
    );
}

// Expects the player's row as gp, the game as g and the highest opponent power as opp.power (OpponentPowerJoinSql)
export const DominantWinSql = `(gp.name = ANY(g.winners) AND gp.power IS NOT NULL AND (
    gp.power - GREATEST(COALESCE(opp.power, 0), 0) >= ${MinPowerGap}
    OR (g.win_reason IS DISTINCT FROM 'power' AND gp.power >= ${MinPowerOtherWin}
        AND GREATEST(COALESCE(opp.power, 0), 0) <= ${MaxOpponentPowerOtherWin})))`;

export const OpponentPowerJoinSql = `LEFT JOIN LATERAL (
    SELECT max(o.power) AS power FROM game_players o WHERE o.game_id = gp.game_id AND o.position <> gp.position
) opp ON true`;
