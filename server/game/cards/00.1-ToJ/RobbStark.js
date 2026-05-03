import DrawCard from '../../drawcard.js';

class RobbStark extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel location to increase STR',
            target: {
                cardCondition: {
                    type: 'character',
                    location: 'play area',
                    participating: true
                }
            },
            cost: ability.costs.kneel((card) => !card.isLimited() && card.getType() === 'location'),
            limit: ability.limit.perRound(2),
            handler: (context) => {
                let str = this.getSTRIncrease(context);
                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to give {3} +{4} STR until the end of the challenge',
                    this.controller,
                    this,
                    context.costs.kneel,
                    context.target,
                    str
                );
                this.untilEndOfChallenge(() => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(str)
                }));
            }
        });
    }

    getSTRIncrease(context) {
        let str = context.costs.kneel.getPrintedCost();
        return this.controller.anyCardsInPlay((card) => card.name === 'Grey Wind') ? str + 1 : str;
    }
}

RobbStark.code = '00221';

export default RobbStark;
