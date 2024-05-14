const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class HightowerSpy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            message:
                '{player} uses {source} to choose {target} and reveal the top card of their deck',
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.revealTopCards((context) => ({
                        player: context.player
                    })).then((preThenContext) => ({
                        handler: (context) => {
                            const topCard = context.event.cards[0];
                            if (topCard.hasPrintedCost()) {
                                const increase = topCard.getPrintedCost();
                                this.game.addMessage(
                                    '{0} gives {1} +{2} STR until the end of the phase',
                                    context.player,
                                    preThenContext.target,
                                    increase
                                );
                                this.untilEndOfPhase((ability) => ({
                                    match: preThenContext.target,
                                    effect: ability.effects.modifyStrength(increase)
                                }));
                            }
                        }
                    })),
                    context
                );
            }
        });
    }
}

HightowerSpy.code = '08063';

module.exports = HightowerSpy;
