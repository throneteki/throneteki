import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ChampionsFavor extends DrawCard {
    // Champion's Favor (15038)
    // Lady character only.
    // Action: Kneel attached character to choose a participating non-Lady character and give it +X
    // STR until the end of the challenge. X is 2 higher than attached character's STR.
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
                    parent: (context) => context.source.parent,
                    strength: (context) => context.source.parent.getStrength() + 2
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(context.source.parent.getStrength() + 2)
            }))
        });
    }
}

ChampionsFavor.code = '15038';

export default ChampionsFavor;
