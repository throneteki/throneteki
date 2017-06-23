const DrawCard = require('../../../drawcard.js');

class SavingTheKingdom extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Make character unable to stand',
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getStrength() <= 3
            },
            handler: context => {
                this.untilEndOfRound(ability => ({
                    match: context.target,
                    effect: ability.effects.doesNotStandDuringStanding()
                }));

                this.game.addMessage('{0} plays {1} to make {2} unable to stand during the standing phase this round', 
                                      this.controller, this, context.target);
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage('{0} pays 1 gold to move {1} back to their hand', this.controller, this);
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

SavingTheKingdom.code = '06068';

module.exports = SavingTheKingdom;
