import DrawCard from '../../drawcard.js';

class IAmNoOne extends DrawCard {
    // I Am No One (17127)
    // Action: Choose Arya Stark or a unique character you control with printed cost 3 or lower.
    // Until the end of the phase, that character loses all faction affiliations and Traits, gains
    // insight, and does not kneel when declared as an attacker.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give character insight',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    (card.name === 'Arya Stark' ||
                        (card.getType() === 'character' &&
                            card.isUnique() &&
                            card.getPrintedCost() <= 3 &&
                            card.controller === this.controller))
            },
            handler: (context) => {
                this.untilEndOfPhase(() => ({
                    match: context.target,
                    effect: [
                        ability.effects.losesAllFactions(),
                        ability.effects.losesAllTraits(),
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

IAmNoOne.code = '17127';

export default IAmNoOne;
