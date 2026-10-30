import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BlackEars extends DrawCard {
    // Black Ears (08029)
    // Reaction: After a character is killed, pay 2 gold to put Black Ears into play from your hand.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event, context) =>
                    context.source.controller.canPutIntoPlay(context.source)
            },
            location: 'hand',
            cost: ability.costs.payGold(2),
            message: '{player} pays 2 gold to put {source} into play from their hand',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            }))
        });
    }
}

BlackEars.code = '08029';

export default BlackEars;
