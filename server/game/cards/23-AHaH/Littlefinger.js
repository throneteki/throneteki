const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class Littlefinger extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDeclaredAsDefender: event => event.card.controller === this.controller && event.card !== this && event.card.isUnique() && event.card.hasTrait('House Arryn')
            },
            target: {
                title: 'Select a character',
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: { participating: true, condition: (card, context) => card.hasPrintedCost() && card.getPrintedCost() <= context.choosingPlayer.getTotalInitiative() }
            },
            message: {
                format: '{player} uses {source} to have each player choose and return {cards} to its owners hands',
                args: { cards: context => context.targets.selections.filter(selection => selection.value).map(selection => selection.value) }
            },
            handler: context => {
                let cards = context.targets.selections.filter(selection => selection.value).map(selection => selection.value);
                this.game.resolveGameAction(
                    GameActions.simultaneously(cards.map(card => GameActions.returnCardToHand({ card }))),
                    context
                );
            }
        });
    }
}

Littlefinger.code = '23018';

module.exports = Littlefinger;
