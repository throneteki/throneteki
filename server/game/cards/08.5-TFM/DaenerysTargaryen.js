const DrawCard = require('../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotDecreaseStrength(
                (context) => context.resolutionStage === 'effect'
            )
        });
        this.reaction({
            when: {
                onCardPlayed: (event) =>
                    event.card.controller === this.controller && event.card.isFaction('targaryen')
            },
            limit: ability.limit.perRound(3),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' && card.getType() === 'character'
            },
            handler: (context) => {
                this.untilEndOfPhase((ability) => ({
                    match: context.target,
                    effect: ability.effects.killByStrength(-1)
                }));

                this.game.addMessage(
                    '{0} uses {1} to give {2} -1 STR until the end of the phase',
                    context.player,
                    this,
                    context.target
                );
            }
        });
    }
}

DaenerysTargaryen.code = '08093';

module.exports = DaenerysTargaryen;
