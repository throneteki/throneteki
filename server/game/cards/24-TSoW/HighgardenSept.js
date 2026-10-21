import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HighgardenSept extends DrawCard {
    // Highgarden Sept (24024)
    // While you have 7 or more cards in your hand, non-The Seven characters cannot enter play
    // during the challenges phase.
    // Reaction: After power is gained by or moved to a The Seven card you control, draw 1 card.
    // (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                this.controller.getHandCount() >= 7 && this.game.currentPhase === 'challenge',
            targetController: 'any',
            effect: ability.effects.cannotPutIntoPlay(
                (card) => card.getType() === 'character' && !card.hasTrait('The Seven')
            )
        });
        this.reaction({
            when: {
                onCardPowerGained: (event) => this.isValidCard(event.card),
                onCardPowerMoved: (event) => this.isValidCard(event.target)
            },
            limit: ability.limit.perPhase(1),
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({
                amount: 1,
                player: context.player,
                source: this
            }))
        });
    }

    isValidCard(card) {
        return card.hasTrait('The Seven') && card.controller === this.controller;
    }
}

HighgardenSept.code = '24024';

export default HighgardenSept;
