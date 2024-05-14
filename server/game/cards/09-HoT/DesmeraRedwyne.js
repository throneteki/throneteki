import DrawCard from '../../drawcard.js';

class DesmeraRedwyne extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRemovedFromChallenge: (event) => event.card.location === 'play area'
            },
            cost: ability.costs.payGold(1),
            choices: {
                'Give +2 STR': (context) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.event.card,
                        effect: ability.effects.modifyStrength(2)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} and pays 1 gold to give {2} +2 STR until the end of the phase',
                        this.controller,
                        this,
                        context.event.card
                    );
                },
                'Give -1 STR': (context) => {
                    this.untilEndOfPhase((ability) => ({
                        match: context.event.card,
                        effect: ability.effects.modifyStrength(-1)
                    }));

                    this.game.addMessage(
                        '{0} uses {1} and pays 1 gold to give {2} -1 STR until the end of the phase',
                        this.controller,
                        this,
                        context.event.card
                    );
                }
            }
        });
    }
}

DesmeraRedwyne.code = '09013';

export default DesmeraRedwyne;
