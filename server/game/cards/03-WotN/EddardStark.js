import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class EddardStark extends DrawCard {
    // Eddard Stark (03003)
    // Renown.
    // Reaction: After Eddard Stark gains power using renown, choose another participating character
    // you control. That character gains 1 power.
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPowerGained: (event, context) =>
                    event.card === context.source && event.reason === 'renown'
            },
            target: {
                activePromptTitle: 'Select character to gain power',
                gameAction: 'gainPower',
                cardCondition: (card, context) => context.source.cardCondition(card)
            },
            message: '{player} uses {source} to have {target} gain 1 power',
            gameAction: GameActions.gainPower((context) => ({ card: context.target, amount: 1 }))
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
