import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Kingswood extends DrawCard {
    setupCardAbilities(ability) {
        this.plotModifiers({
            initiative: 1
        });
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.playingType === 'ambush' &&
                    event.card.isMatch({ type: 'character', controller: 'current' })
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
