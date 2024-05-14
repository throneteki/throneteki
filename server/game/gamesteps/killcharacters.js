const GameActions = require('../GameActions/index.js');
const BaseStep = require('./basestep.js');

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

module.exports = KillCharacters;
