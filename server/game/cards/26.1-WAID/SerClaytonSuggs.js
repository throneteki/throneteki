import DrawCard from '../../drawcard.js';

class SerClaytonSuggs extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPowerGained: (event) => event.card.getType() === 'character',
                onCardPowerMoved: (event) => event.target.getType() === 'character'
            },
            limit: ability.limit.perPhase(3),
            choices: {
                'Give +1 STR': (context) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.event.target || context.event.card,
                        effect: ability.effects.modifyStrength(2)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to give {2} +1 STR until the end of the phase',
                        this.controller,
                        this,
                        context.event.target || context.event.card
                    );
                },
                'Give -1 STR': (context) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.event.target || context.event.card,
                        effect: ability.effects.modifyStrength(-1)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} to give {2} -1 STR until the end of the phase',
                        this.controller,
                        this,
                        context.event.target || context.event.card
                    );
                }
            }
        });
    }
}

SerClaytonSuggs.code = '26001';

export default SerClaytonSuggs;
