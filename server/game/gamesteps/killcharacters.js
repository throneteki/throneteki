import GameActions from '../GameActions/index.js';
import BaseStep from './basestep.js';

class KillCharacters extends BaseStep {
    constructor(game, cards, options) {
        super(game);

        this.cards = cards;
        this.options = options;
    }

    continue() {
        this.game.resolveGameAction(
            GameActions.simultaneously(
                this.cards.map((card) =>
                    GameActions.kill({
                        allowSave: this.options.allowSave,
                        card,
                        force: this.options.force,
                        isBurn: this.options.isBurn
                    })
                )
            )
        );
    }
}

export default KillCharacters;
