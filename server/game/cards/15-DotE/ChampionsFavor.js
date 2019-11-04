const DrawCard = require('../../drawcard.js');

class ChampionsFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });
        this.action({
            title: 'Give STR',
            cost: ability.costs.kneelParent(),
            target: {
                cardCondition: card => card.isParticipating() && !card.hasTrait('Lady') && card.getType() === 'character'
            },
            handler: context => {
                let str = this.parent.getStrength() + 2;
                this.game.addMessage('{0} uses {1} and kneels {2} to give {3} +{4} STR until the end of the challenge',
                    this.controller, this, this.parent, context.target, str);
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(str)
                }));
            }
        });
    }
}

ChampionsFavor.code = '15038';

module.exports = ChampionsFavor;
