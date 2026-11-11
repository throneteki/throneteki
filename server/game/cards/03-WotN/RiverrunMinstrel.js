import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RiverrunMinstrel extends DrawCard {
    // Riverrun Minstrel (03009)
    // Reaction: After Riverrun Minstrel enters play, choose a House Tully character. That character
    // gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.hasTrait('House Tully') &&
                    card.getType() === 'character',
                gameAction: 'gainPower'
            },
            message: '{player} uses {source} to have {target} gain a power',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
        });
    }
}

RiverrunMinstrel.code = '03009';

export default RiverrunMinstrel;
