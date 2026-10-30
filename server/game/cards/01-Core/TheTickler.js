import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheTickler extends DrawCard {
    // The Tickler (01088)
    // Dominance Action: Kneel The Tickler to discard the top card of an opponent's deck. Then, you
    // may choose 1 copy of that card, and discard it from play.
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard opponents top card',
            phase: 'dominance',
            chooseOpponent: true,
            cost: ability.costs.kneelSelf(),
            message: "{player} uses {source} to discard the top card of {opponent}'s deck",
            gameAction: GameActions.discardTopCards((context) => ({
                player: context.opponent,
                amount: 1
            })).then((context, event) => ({
                gameAction: GameActions.chooseCards({
                    title: 'Select a copy to discard from play',
                    optional: true,
                    cardCondition: (card) =>
                        card.location === 'play area' && card.isCopyOf(event.topCards[0]),
                    gameAction: (card) => GameActions.discardCard({ card })
                })
            }))
        });
    }
}

TheTickler.code = '01088';

export default TheTickler;
