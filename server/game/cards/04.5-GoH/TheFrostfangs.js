import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheFrostfangs extends DrawCard {
    // The Frostfangs (04098)
    // Reaction: After The Frostfangs enters play, give control of it to an opponent.
    // -1 Reserve.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            chooseOpponent: true,
            message: '{player} uses {source} to give control of {source} to {opponent}',
            gameAction: GameActions.takeControl((context) => ({
                player: context.opponent,
                card: context.source
            }))
        });
        this.plotModifiers({
            reserve: -1
        });
    }
}

TheFrostfangs.code = '04098';

export default TheFrostfangs;
