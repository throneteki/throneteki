import DrawCard from '../../drawcard.js';

class SalladhorSaan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.isParticipating()
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card) =>
                    card.location === 'hand' &&
                    card.controller === this.controller &&
                    ((card.hasTrait('Warship') && card.getType() === 'location') ||
                        (card.hasTrait('Weapon') && card.getType() === 'attachment'))
            },
            handler: (context) => {
                this.controller.putIntoPlay(context.target);
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

SalladhorSaan.code = '04107';

export default SalladhorSaan;
