import DrawCard from '../../drawcard.js';

class IronFleetScout extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character +STR',
            cost: ability.costs.kneelSelf(),
            target: {
                cardCondition: (card) =>
                    card.getType() === 'character' &&
                    card.location === 'play area' &&
                    card.isParticipating() &&
                    card.isFaction('greyjoy')
            },
            handler: (context) => {
                let strBoost = this.controller.firstPlayer ? 2 : 1;
                this.game.addMessage(
                    '{0} kneels {1} to give {2} +{3} STR until the end of the challenge',
                    this.controller,
                    this,
                    context.target,
                    strBoost
                );

                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(strBoost)
                }));
            }
        });
    }
}

IronFleetScout.code = '01079';

export default IronFleetScout;
