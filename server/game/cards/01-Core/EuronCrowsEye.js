import DrawCard from '../../drawcard.js';

class EuronCrowsEye extends DrawCard {
    // Euron Crow's Eye (01069)
    // Pillage. Renown.
    // Reaction: After Euron Crow's Eye discards a card using pillage, put a location from the
    // losing opponent's discard pile into play under your control.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardDiscarded: (event) => event.isPillage && event.source === this
            },
            target: {
                activePromptTitle: 'Select location',
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage(
                    "{0} uses {1} to put {2} into play from their opponent's discard pile",
                    context.player,
                    this,
                    context.target
                );
            }
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
