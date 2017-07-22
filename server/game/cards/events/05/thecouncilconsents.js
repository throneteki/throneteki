const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheCouncilConsents extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.challengeType === 'intrigue' && 
                    challenge.strengthDifference >= 5 &&
                    this.anySmallCouncilCharacterInPlay())
            },
            handler: () => {
                let ownSmallCouncilChars = this.controller.filterCardsInPlay(card => card.hasTrait('Small Council') && card.getType() === 'character');

                let opponent = this.game.getOtherPlayer(this.controller);
                let opponentSmallCouncilChars = opponent.filterCardsInPlay(card => card.hasTrait('Small Council') && card.getType() === 'character');

                let allSmallCouncilChars = ownSmallCouncilChars.concat(opponentSmallCouncilChars);

                _.each(allSmallCouncilChars, card => {
                    card.controller.standCard(card);
                });

                this.game.addMessage('{0} plays {1} to stand {2}',
                    this.controller, this, allSmallCouncilChars);
            }
        });
    }

    anySmallCouncilCharacterInPlay() {
        let opponent = this.game.getOtherPlayer(this.controller);
        return this.controller.anyCardsInPlay(card => card.hasTrait('Small Council') && card.getType() === 'character') ||
               (opponent && opponent.anyCardsInPlay(card => card.hasTrait('Small Council') && card.getType() === 'character'));
    }
}

TheCouncilConsents.code = '05044';

module.exports = TheCouncilConsents;
