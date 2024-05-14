const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class Oathkeeper extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyStrength(2)
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    event.challenge.isParticipating(this.parent)
            },
            cost: ability.costs.sacrificeSelf(),
            message:
                '{player} sacrifices {costs.sacrifice} to search their deck for a non-Tyrell character',
            gameAction: GameActions.search({
                title: 'Select a character',
                match: { type: 'character', not: { faction: 'tyrell' } },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

Oathkeeper.code = '08005';

module.exports = Oathkeeper;
