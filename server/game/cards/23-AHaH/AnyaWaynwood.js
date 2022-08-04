const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class AnyaWaynwood extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Harry the Heir' && card.controller === this.controller,
            effect: ability.effects.addKeyword('Renown')
        });

        this.reaction({
            when: {
                onChallengeInitiated: event => event.challenge.initiatedAgainstPlayer === this.controller
            },
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.isFaction('neutral')),
            target: {
                title: 'Select a character',
                cardCondition: { attacking: true, condition: (card, context) => !context.costs.kneel || card.getPrintedCost() <= context.costs.kneel.getPrintedCost() }
            },
            message: {
                format: '{player} uses {source} and kneels {kneel} to kneel and take control of {target} until the end of the challenge',
                args: { kneel: context => context.costs.kneel }
            },
            handler: context => {
                this.game.resolveGameAction(GameActions.kneelCard({ card: context.target }), context);
                this.untilEndOfChallenge(ability => ({
                    match: context.target,
                    effect: ability.effects.takeControl(this.controller)
                }));
            }
        });
    }
}

AnyaWaynwood.code = '23019';

module.exports = AnyaWaynwood;
