import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EuronCrowsEye extends DrawCard {
    // Euron Crow's Eye (01069)
    // Pillage. Renown.
    // Reaction: After Euron Crow's Eye discards a card using pillage, put a location from the
    // losing opponent's discard pile into play under your control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.isPillage && event.source === context.source
            },
            target: {
                activePromptTitle: 'Select location',
                cardCondition: (card, context) => context.source.cardCondition(card)
            },
            message:
                "{player} uses {source} to put {target} into play from their opponent's discard pile",
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }

    cardCondition(card) {
        return (
            card.controller === this.game.currentChallenge.loser &&
            card.getType() === 'location' &&
            card.location === 'discard pile' &&
            this.controller.canPutIntoPlay(card)
        );
    }
}

EuronCrowsEye.code = '01069';

export default EuronCrowsEye;
