import DrawCard from '../../drawcard.js';

class SavingTheKingdom extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel and make character unable to stand',
            phase: 'challenge',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getStrength() <= 3
            },
            handler: (context) => {
                context.target.controller.kneelCard(context.target);

                this.untilEndOfRound((ability) => ({
                    condition: () => this.game.currentPhase === 'standing',
                    match: context.target,
                    effect: ability.effects.cannotBeStood()
                }));

                this.game.addMessage(
                    '{0} plays {1} to kneel and make {2} unable to stand during the standing phase this round',
                    this.controller,
                    this,
                    context.target
                );
            }
        });

        this.reaction({
            location: 'discard pile',
            when: {
                onDominanceDetermined: (event) => this.controller === event.winner
            },
            ignoreEventCosts: true,
            cost: ability.costs.payGold(1),
            handler: () => {
                this.game.addMessage(
                    '{0} pays 1 gold to move {1} back to their hand',
                    this.controller,
                    this
                );
                this.controller.moveCard(this, 'hand');
            }
        });
    }
}

SavingTheKingdom.code = '06068';

export default SavingTheKingdom;
