const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class Ghost extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.controller.anyCardsInPlay(card => card.isAttacking() && card.hasTrait('Direwolf') && card.getType() === 'character')
            },
            message: '{player} uses {source} to draw 1 card',
            gameAction: GameActions.drawCards({ amount: 1 })
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: event => event.allowSave && event.card.canBeSaved() && event.card.name === 'Jon Snow'
            },
            cost: ability.costs.sacrificeSelf(),
            message: {
                format: '{player} sacrifices {costs.sacrifice} to save {card}',
                args: { card: context => context.event.card }
            },
            handler: context => {
                context.event.saveCard();
            }
        });
    }
}

Ghost.code = '25564';
Ghost.version = '1.0';

module.exports = Ghost;
