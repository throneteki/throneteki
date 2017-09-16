const DrawCard = require('../../drawcard.js');

class RobbStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => (
                this.game.currentChallenge &&
                this.game.currentChallenge.challengeType === 'military'
            ),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.numberOfLoyalChars())
        });

        this.action({
            title: 'Stand and remove a character from the challenge',
            limit: ability.limit.perChallenge(1),
            condition: () => this.isParticipatingInMilitaryChallenge(),
            target: {
                cardCondition: card => this.isParticipatingNonKing(card)
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);

                this.game.addMessage('{0} uses {1} to stand {2} and remove them from the challenge', this.controller, this, context.target);
            }
        });
    }

    isParticipatingInMilitaryChallenge() {
        return (
            this.game.currentChallenge &&
            this.game.currentChallenge.challengeType === 'military' &&
            this.game.currentChallenge.isParticipating(this)
        );
    }

    isParticipatingNonKing(card) {
        return (
            card.location === 'play area' &&
            card.getType() === 'character' &&
            !card.hasTrait('King') &&
            this.game.currentChallenge.isParticipating(card)
        );
    }

    numberOfLoyalChars () {
        var cards = this.controller.filterCardsInPlay(card => {
            return card.isLoyal() && card.getType() === 'character';
        });

        return cards.length;
    }
}

RobbStark.code = '04002';

module.exports = RobbStark;
