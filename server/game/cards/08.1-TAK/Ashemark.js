const DrawCard = require('../../drawcard.js');
const {Tokens} = require('../../Constants');
const GameActions = require('../../GameActions/index.js');

class Ashemark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => this.hasToken(Tokens.gold)
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            message: {
                format: '{player} kneels and sacrifices {costs.kneel} to return each character with printed cost {gold} or less to its owner\'s hand',
                args: { gold: context => context.cardStateWhenInitiated.tokens.gold }
            },
            gameAction: GameActions.simultaneously(context => 
                context.game.filterCardsInPlay(card => card.isMatch({ type: 'character', printedCostOrLower: context.cardStateWhenInitiated.tokens.gold }))
                    .map(card => GameActions.returnCardToHand({ card }))
            )
        });
    }
}

Ashemark.code = '08011';

module.exports = Ashemark;
