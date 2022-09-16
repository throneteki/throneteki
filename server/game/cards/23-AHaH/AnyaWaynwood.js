const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class AnyaWaynwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Harry the Heir' && card.controller === this.controller,
            effect: ability.effects.addKeyword('Renown')
        });

        this.action({
            title: 'Contribute STR and kneel',
            phase: 'challenge',
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.isFaction('neutral')),
            condition: () => this.game.isDuringChallenge(),
            limit: ability.limit.perPhase(1),
            target: {
                title: 'Select a character',
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: false,
                    condition: (card, context) => !context.costs.kneel || card.getPrintedCost() <= context.costs.kneel.getPrintedCost()
                }
            },
            message: {
                format: '{player} uses {source} and kneels {kneel} to have {target} contribute its STR (currently {STR}) to {player}\'s side until the end of the challenge',
                args: {
                    kneel: context => context.costs.kneel,
                    STR: context => context.target.getStrength()
                }
            },
            handler: context => {
                this.untilEndOfChallenge(ability => ({
                    // Force the effect to recalculate mid-challenge in case the character STR changes
                    condition: () => true,
                    targetController: 'current',
                    effect: ability.effects.contributeChallengeStrength(() => context.target.getStrength())
                }));
            }
        });
    }
}

AnyaWaynwood.code = '23019';

module.exports = AnyaWaynwood;
