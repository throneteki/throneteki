import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SilencesCrew extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardOutOfShadows: (event) => event.card === this && this.controller.firstPlayer
            },
            message: {
                format: '{player} uses {source} to stand {cards}',
                args: { cards: () => this.getCharactersWithPillage() }
            },
            gameAction: GameActions.simultaneously(() =>
                this.getCharactersWithPillage().map((card) => GameActions.standCard({ card }))
            )
        });
    }

    getCharactersWithPillage() {
        return this.controller.filterCardsInPlay(
            (card) => card.getType() === 'character' && card.hasKeyword('pillage')
        );
    }
}

SilencesCrew.code = '27516';
SilencesCrew.version = '1.0.0';

export default SilencesCrew;
