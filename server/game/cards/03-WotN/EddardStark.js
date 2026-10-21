import DrawCard from '../../drawcard.js';

class EddardStark extends DrawCard {
    // Eddard Stark (03003)
    // Renown.
    // Reaction: After Eddard Stark gains power using renown, choose another participating character
    // you control. That character gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPowerGained: (event) => event.card === this && event.reason === 'renown'
            },
            target: {
                activePromptTitle: 'Select character to gain power',
                gameAction: 'gainPower',
                cardCondition: (card) => this.cardCondition(card)
            },
            handler: (context) => {
                context.target.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }

    cardCondition(card) {
        return (
            card !== this &&
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.isParticipating()
        );
    }
}

EddardStark.code = '03003';

export default EddardStark;
