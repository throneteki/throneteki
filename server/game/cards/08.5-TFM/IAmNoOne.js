import DrawCard from '../../drawcard.js';

class IAmNoOne extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character stealth/insight',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedCost() <= 3 &&
                    card.controller === this.controller
            },
            handler: (context) => {
                this.untilEndOfPhase(() => ({
                    match: context.target,
                    effect: [
                        ability.effects.losesAllFactions(),
                        ability.effects.losesAllTraits(),
                        ability.effects.addKeyword('stealth'),
                        ability.effects.addKeyword('insight'),
                        ability.effects.doesNotKneelAsAttacker()
                    ]
                }));

                this.game.addMessage(
                    '{0} plays {1} and chooses {2} as its target',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

IAmNoOne.code = '08082';

export default IAmNoOne;
