const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions');

class AllMenAreFools extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perPhase(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.hasLady()
            },
            target: {
                mode: 'upTo',
                numCards: 5,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.hasTrait('Lady')
            },
            message: '{player} plays {source} to have {target} each gain 1 power',
            handler: (context) => {
                for (let card of context.target) {
                    this.game.resolveGameAction(GameActions.gainPower({ card: card, amount: 1 }));
                }
            }
        });
    }

    hasLady() {
        return this.controller.anyCardsInPlay(
            (card) =>
                card.hasTrait('Lady') &&
                card.getType() === 'character' &&
                card.allowGameAction('gainPower')
        );
    }
}

AllMenAreFools.code = '17140';

module.exports = AllMenAreFools;
