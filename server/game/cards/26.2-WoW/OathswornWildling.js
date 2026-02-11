import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OathswornWildling extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onSetupFinished', 'onCardEntersPlay', 'onCardLeftPlay']);
    }

    onSetupFinished() {
        if (this.location === 'play area') {
            this.checkSacrifice();
        }
    }

    onCardEntersPlay(event) {
        if (this.game.currentPhase !== 'setup' && event.card === this) {
            this.checkSacrifice();
        }
    }

    onCardLeftPlay(event) {
        if (this.game.currentPhase !== 'setup' && event.card.controller === this.controller) {
            this.checkSacrifice();
        }
    }

    checkSacrifice() {
        if (
            !this.controller.anyCardsInPlay(
                (card) =>
                    card.getType() === 'character' &&
                    card !== this &&
                    (card.hasTrait('Wildling') || card.name === 'Jon Snow')
            )
        ) {
            this.game.addMessage(
                '{0} is forced to sacrifice {1} as they control no other Wildlings or Jon Snow',
                this.controller,
                this
            );
            this.game.resolveGameAction(GameActions.sacrificeCard({ card: this }));
        }
    }
}

OathswornWildling.code = '26029';

export default OathswornWildling;
