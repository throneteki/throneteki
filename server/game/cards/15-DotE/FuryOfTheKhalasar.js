import PlotCard from '../../plotcard.js';

class FuryOfTheKhalasr extends PlotCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event) => event.phase === 'challenge'
            },
            target: {
                type: 'select',
                cardCondition: (card, context) =>
                    card.isMatch({
                        controller: context.player,
                        location: 'hand',
                        trait: 'Dothraki',
                        type: 'character'
                    }) && context.player.canPutIntoPlay(card)
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to put {2} into play',
                    context.player,
                    context.source,
                    context.target
                );
                context.player.putIntoPlay(context.target);
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    targetLocation: 'any',
                    effect: ability.effects.returnToHandIfStillInPlay(true)
                }));
            }
        });
    }
}

FuryOfTheKhalasr.code = '15046';

export default FuryOfTheKhalasr;
