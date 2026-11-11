import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

function numberOfWinterPlots(game) {
    return game
        .getPlayers()
        .filter((player) => player.activePlot && player.activePlot.hasTrait('Winter')).length;
}

class TheFrozenShore extends DrawCard {
    // The Frozen Shore (07042)
    // Reaction: After you win a challenge, kneel The Frozen Shore to choose and stand 1 attacking
    // Wildling character for each Winter plot card revealed.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.winner === context.player &&
                    numberOfWinterPlots(context.game) > 0
            },
            cost: ability.costs.kneelSelf(),
            target: {
                mode: 'upTo',
                numCards: (context) => numberOfWinterPlots(context.game),
                activePromptTitle: 'Select Wildlings to stand',
                cardCondition: (card) => card.isAttacking() && card.hasTrait('Wildling'),
                gameAction: 'stand'
            },
            message: '{player} kneels {source} to stand {target}',
            gameAction: GameActions.simultaneously((context) =>
                context.target.map((card) => GameActions.standCard({ card }))
            )
        });
    }
}

TheFrozenShore.code = '07042';

export default TheFrozenShore;
