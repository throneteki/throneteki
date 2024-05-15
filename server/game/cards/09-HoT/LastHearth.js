import DrawCard from '../../drawcard.js';

class LastHearth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Increase character STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.isFaction('stark') &&
                    card.isParticipating()
            },
            handler: (context) => {
                let strengthBonus = this.controller.getNumberOfUsedPlots() < 3 ? 3 : 2;
                this.game.addMessage(
                    '{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    this.controller,
                    this,
                    context.target,
                    strengthBonus
                );
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strengthBonus)
                }));
            }
        });
    }
}

LastHearth.code = '09036';

export default LastHearth;
