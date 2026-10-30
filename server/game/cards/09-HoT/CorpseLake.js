import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class CorpseLake extends DrawCard {
    // Corpse Lake (09028)
    // Reaction: After a character is discarded from an opponent's deck, Corpse Lake gains 1 power.
    // (Limit 3 times per round.)
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.originalLocation === 'draw deck' &&
                    event.card.getType() === 'character' &&
                    event.card.controller !== context.source.controller &&
                    context.source.allowGameAction('gainPower')
            },
            limit: ability.limit.perRound(3),
            message: '{player} gains 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });
    }
}

CorpseLake.code = '09028';

export default CorpseLake;
