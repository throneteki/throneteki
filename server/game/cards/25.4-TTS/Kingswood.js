import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Kingswood extends DrawCard {
    // Kingswood (25066)
    // Reaction: After a character you control enters play using ambush, kneel and return Kingswood
    // to your hand to draw 1 card.
    // +1 Initiative.
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.playingType === 'ambush' &&
                    event.card.controller === context.source.controller &&
                    event.card.isMatch({ type: 'character' })
            },
            cost: [ability.costs.kneelSelf(), ability.costs.returnSelfToHand()],
            message:
                '{player} kneels and returns {costs.returnToHand} to their hand to draw 1 card',
            gameAction: GameActions.drawCards((context) => ({ player: context.player, amount: 1 }))
        });
    }
}

Kingswood.code = '25066';

export default Kingswood;
