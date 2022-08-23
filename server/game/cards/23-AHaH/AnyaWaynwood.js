const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class AnyaWaynwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Harry the Heir' && card.controller === this.controller,
            effect: ability.effects.addKeyword('Renown')
        });

        this.action({
            title: 'Kneel character',
            phase: 'challenge',
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.isFaction('neutral')),
            target: {
                title: 'Select a character',
                cardCondition: {
                    location: 'play area',
                    type: 'character',
                    participating: false,
                    kneeled: false,
                    condition: (card, context) => !context.costs.kneel || card.getPrintedCost() <= context.costs.kneel.getPrintedCost()
                }
            },
            message: {
                format: '{player} uses {source} and kneels {kneel} to kneel and have it contribute its STR to {player}',
                args: { kneel: context => context.costs.kneel }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.kneelCard({ card: context.target }), context);
                if(this.game.isDuringChallenge()) {
                    this.untilEndOfChallenge(ability => ({
                        // Force the effect to recalculate mid-challenge in case the character STR changes
                        condition: () => true,
                        targetController: 'current',
                        effect: ability.effects.contributeChallengeStrength(() => context.target.getStrength())
                    }));
                }
            }
        });
    }
}

AnyaWaynwood.code = '23019';

module.exports = AnyaWaynwood;
