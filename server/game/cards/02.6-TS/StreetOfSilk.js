const DrawCard = require('../../drawcard.js');
const GameActions = require('../../GameActions/index.js');

class StreetOfSilk extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller && this.hasParticipatingLordOrLady()
            },
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} uses {source} and kneels their faction card to search the top 5 cards of their deck for an Ally or Companion card',
            gameAction: GameActions.search({
                topCards: 5,
                title: 'Select a card',
                match: {
                    type: 'character',
                    trait: ['Ally', 'Companion']
                },
                message: '{player} {gameAction}',
                gameAction: GameActions.addToHand((context) => ({
                    card: context.searchTarget
                }))
            })
        });
    }

    hasParticipatingLordOrLady() {
        let challenge = this.game.currentChallenge;
        if (!challenge) {
            return false;
        }

        let ourCards =
            challenge.attackingPlayer === this.controller
                ? challenge.attackers
                : challenge.defenders;
        return ourCards.some((card) => card.hasTrait('Lord') || card.hasTrait('Lady'));
    }
}

StreetOfSilk.code = '02118';

module.exports = StreetOfSilk;
