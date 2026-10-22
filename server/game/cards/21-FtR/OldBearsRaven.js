import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class OldBearsRaven extends DrawCard {
    // Old Bear's Raven (21014)
    // Ambush (2). No attachments.
    // Action: Return Old Bear's Raven to your hand to stand Old Bear Mormont. (Max twice per
    // round.)
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Old Bear',
            cost: ability.costs.returnSelfToHand(),
            max: ability.limit.perRound(2),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.name === 'Old Bear Mormont' &&
                    card.kneeled,
                gameAction: 'stand'
            },
            message: '{player} returns {source} back to hand to stand {target}',
            gameAction: GameActions.standCard((context) => ({ card: context.target }))
        });
    }
}

OldBearsRaven.code = '21014';

export default OldBearsRaven;
