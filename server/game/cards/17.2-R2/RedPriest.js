import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class RedPriest extends DrawCard {
    // Red Priest (17161)
    // Reaction: After Red Priest enters play, look at an opponent's hand. Then, choose 1 card in
    // that hand and remove it from the game until the end of the round or until Red Priest leaves
    // play.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            chooseOpponent: (opponent) => opponent.hand.length > 0,
            message: "{player} uses {source} to look at {opponent}'s hand",
            gameAction: GameActions.lookAtHand((context) => ({
                player: context.player,
                opponent: context.opponent
            })).then({
                target: {
                    activePromptTitle: 'Select a card',
                    cardCondition: (card, context) =>
                        card.location === 'hand' &&
                        card.controller === context.parentContext.opponent,
                    revealTargets: true
                },
                message: 'Then {player} uses {source} to remove {target} from the game',
                gameAction: GameActions.lastingEffect((context) => ({
                    duration: 'custom',
                    until: {
                        onCardLeftPlay: (event) => event.card === context.source,
                        onRoundEnded: () => true
                    },
                    targetController: 'any',
                    match: context.target,
                    targetLocation: ['hand', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }))
            })
        });
    }
}

RedPriest.code = '17161';

export default RedPriest;
