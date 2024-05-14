const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class StreetOfSteel extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.challengeType === 'military'
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to search the top 10 cards of their deck for a Weapon or Item attachment',
            gameAction: GameActions.search({
                topCards: 10,
                title: 'Select an attachment',
                match: {
                    type: 'attachment',
                    trait: ['Weapon', 'Item']
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }
}

StreetOfSteel.code = '02097';

module.exports = StreetOfSteel;
