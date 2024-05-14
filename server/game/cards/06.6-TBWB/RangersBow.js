import DrawCard from '../../drawcard.js';

class RangersBow extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ faction: 'thenightswatch' });

        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });

        this.action({
            title: 'Give defending character +2 STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.isFaction('thenightswatch') &&
                    card.getType() === 'character' &&
                    card.isDefending()
            },
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));

                this.game.addMessage(
                    '{0} kneels {1} to give {2} +2 STR until the end of the challenge',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

RangersBow.code = '06106';

export default RangersBow;
