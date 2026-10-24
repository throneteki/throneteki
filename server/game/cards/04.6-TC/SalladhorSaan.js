import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SalladhorSaan extends DrawCard {
    // Salladhor Saan (04107)
    // Reaction: After you win a challenge in which Salladhor Saan is participating, put a Warship
    // location or Weapon attachment into play from your hand.
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            target: {
                activePromptTitle: 'Select a card',
                cardCondition: (card, context) =>
                    card.location === 'hand' &&
                    card.controller === context.source.controller &&
                    ((card.hasTrait('Warship') && card.getType() === 'location') ||
                        (card.hasTrait('Weapon') && card.getType() === 'attachment'))
            },
            message: '{player} uses {source} to put {target} into play',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.target
            }))
        });
    }
}

SalladhorSaan.code = '04107';

export default SalladhorSaan;
