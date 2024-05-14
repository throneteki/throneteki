const DrawCard = require('../../drawcard.js');

class WinterfellCrypt extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onSacrificed: (event) => this.triggerCondition(event.cardStateWhenSacrificed),
                onCharacterKilled: (event) => this.triggerCondition(event.cardStateWhenKilled)
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPrintedStrength() <= context.event.card.getPrintedStrength()
            },
            handler: (context) => {
                this.atEndOfPhase((ability) => ({
                    match: context.target,
                    condition: () => ['play area', 'duplicate'].includes(context.target.location),
                    effect: ability.effects.shuffleIntoDeckIfStillInPlay()
                }));

                this.game.addMessage(
                    '{0} sacrifices {1} to choose {2}',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }

    triggerCondition(card) {
        return (
            card.controller === this.controller &&
            card.isUnique() &&
            card.isFaction('stark') &&
            card.getType() === 'character' &&
            this.game.currentPhase === 'challenge'
        );
    }
}

WinterfellCrypt.code = '02082';

module.exports = WinterfellCrypt;
