import GameAction from './GameAction.js';

class SelectTitles extends GameAction {
    constructor() {
        super('selectTitles');
    }

    canChangeGameState({ pool, selections }) {
        return selections.length > 0 && selections.every(({ title }) => pool.cards.includes(title));
    }

    createEvent({ pool, selections }) {
        return this.event(
            'onTitlesEnteredPlay',
            { titles: selections.map(({ title }) => title) },
            () => {
                for (const { player, title } of selections) {
                    pool.chooseFromPool(player, title);
                    title.facedown = false;
                }
                pool.announceTitles(selections);
            }
        );
    }
}

export default new SelectTitles();
