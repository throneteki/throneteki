const DrawCard = require('../../drawcard.js');

class OutfittedForWar extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ type: 'location', trait: 'Warship' });

        this.action({
            title: 'Give +3 STR',
            condition: () =>
                !!this.parent && this.game.isDuringChallenge({ challengeType: 'military' }),
            cost: ability.costs.kneelParent(),
            target: {
                cardCondition: (card) =>
                    card.isParticipating() &&
                    card.isFaction('greyjoy') &&
                    card.getType() === 'character'
            },
            message: '{player} kneels {source} to give {target} +3 STR',
            handler: (context) => {
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(3)
                }));
            }
        });
    }
}

OutfittedForWar.code = '13052';

module.exports = OutfittedForWar;
