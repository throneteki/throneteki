const DrawCard = require('../../drawcard');
const GameActions = require('../../GameActions');

class NestorRoyce extends DrawCard {
    setupCardAbilities(ability) {
        const kneelingDefender = { location: 'play area', type: 'character', faction: 'neutral', kneeled: true, defending: true };
        const minimumKneltCost = () => {
            if(!this.game.currentChallenge) {
                return 99;
            }

            const costs = this.game.currentChallenge.defenders.filter(card => card.isMatch(kneelingDefender)).map(card => card.getPrintedCost());
            if(costs.length === 0) {
                return 99;
            }
            return Math.min(...costs);
        };

        this.reaction({
            when: {
                afterChallenge: event => this.isDefending() && event.challenge.isMatch({ winner: this.controller })
            },
            cost: [
                ability.costs.placeOnBottomFromHand(card => card.getPrintedCost() >= minimumKneltCost())
            ],
            target: {
                type: 'select',
                cardCondition: (card, context) => card.isMatch({
                    printedCostOrLower: context.costs.placeBottom ? context.costs.placeBottom.getPrintedCost() : 99,
                    ...kneelingDefender
                })
            },
            message: {
                format: '{player} uses {source}, reveals and places {placeBottom} on the bottom of their deck to stand {target}',
                args: { placeBottom: context => context.costs.placeBottom }
            },
            handler: context => {
                this.game.resolveGameAction(
                    GameActions.standCard(context => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

NestorRoyce.code = '23024';

module.exports = NestorRoyce;
