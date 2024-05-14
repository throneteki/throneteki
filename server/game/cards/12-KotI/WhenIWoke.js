import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhenIWoke extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'military' && !!event.challenge.loser
            },
            target: {
                choosingPlayer: (player, context) => player === context.event.challenge.loser,
                activePromptTitle: 'Select a card',
                cardCondition: { participating: true }
            },
            message: "{player} plays {source} to place {target} on top of its owner's deck",
            max: ability.limit.perChallenge(1),
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.returnCardToDeck((context) => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

WhenIWoke.code = '12044';

export default WhenIWoke;
