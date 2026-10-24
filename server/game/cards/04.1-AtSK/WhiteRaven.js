import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WhiteRaven extends DrawCard {
    // White Raven (04008)
    // Forced Reaction: After you lose a [power] challenge, sacrifice White Raven.
    // Reaction: After you win dominance, if there is a Summer or Winter plot card revealed, gain 1
    // power for your faction.
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.loser === context.source.controller &&
                    event.challenge.challengeType === 'power'
            },
            message: '{player} is forced by {source} to sacrifice {source}',
            gameAction: GameActions.sacrificeCard((context) => ({ card: context.source }))
        });
        this.reaction({
            when: {
                onDominanceDetermined: (event, context) =>
                    context.source.controller.canGainFactionPower() &&
                    context.source.controller === event.winner &&
                    (context.source.anyPlotHasTrait('Summer') ||
                        context.source.anyPlotHasTrait('Winter'))
            },
            message: '{player} uses {source} to gain 1 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }

    anyPlotHasTrait(trait) {
        return this.game.getNumberOfPlotsWithTrait(trait) > 0;
    }
}

WhiteRaven.code = '04008';

export default WhiteRaven;
