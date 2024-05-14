const DrawCard = require('../../drawcard.js');

class ChampionsFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Lady' });
        this.action({
            title: 'Give STR',
            cost: ability.costs.kneelParent(),
            target: {
                cardCondition: (card) =>
                    card.isParticipating() &&
                    !card.hasTrait('Lady') &&
                    card.getType() === 'character'
            },
            message: {
                format: '{player} uses {source} and kneels {parent} to give {target} +{strength} STR until the end of the challenge',
                args: {
                    parent: () => this.parent,
                    strength: () => this.parent.getStrength() + 2
                }
            },
            handler: (context) => {
                let str = this.parent.getStrength() + 2;
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(str)
                }));
            }
        });
    }
}

ChampionsFavor.code = '15038';

module.exports = ChampionsFavor;
