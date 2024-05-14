const DrawCard = require('../../drawcard.js');

class TheCouncilConsents extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.challengeType === 'intrigue' &&
                    event.challenge.strengthDifference >= 5 &&
                    this.anySmallCouncilCharacterInPlay()
            },
            handler: () => {
                let smallCouncilChars = this.game.filterCardsInPlay(
                    (card) => card.hasTrait('Small Council') && card.getType() === 'character'
                );

                for (let card of smallCouncilChars) {
                    card.controller.standCard(card);
                }

                this.game.addMessage(
                    '{0} plays {1} to stand {2}',
                    this.controller,
                    this,
                    smallCouncilChars
                );
            }
        });
    }

    anySmallCouncilCharacterInPlay() {
        return this.game.anyCardsInPlay(
            (card) => card.hasTrait('Small Council') && card.getType() === 'character'
        );
    }
}

TheCouncilConsents.code = '05044';

module.exports = TheCouncilConsents;
