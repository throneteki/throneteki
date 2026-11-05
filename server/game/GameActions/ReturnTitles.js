import GameAction from './GameAction.js';

class ReturnTitles extends GameAction {
    constructor() {
        super('returnTitles');
    }

    canChangeGameState({ players }) {
        return players.some((player) => !!player.title);
    }

    createEvent({ pool, players }) {
        const selections = players
            .filter((player) => !!player.title)
            .map((player) => ({ player, title: player.title }));
        return this.event(
            'onTitlesReturnedToPool',
            { titles: selections.map(({ title }) => title) },
            () => {
                for (const { player, title } of selections) {
                    pool.returnToPool(player, title);
                }
            }
        );
    }
}

export default new ReturnTitles();
