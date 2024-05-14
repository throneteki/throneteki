import DrawCard from '../../drawcard.js';

class RobbStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.game.isDuringChallenge({ challengeType: 'military' }),
            match: this,
            effect: ability.effects.dynamicStrength(() => this.numberOfLoyalChars())
        });

        this.action({
            title: 'Stand and remove a character from the challenge',
            limit: ability.limit.perChallenge(1),
            condition: () => this.isParticipatingInMilitaryChallenge(),
            target: {
                cardCondition: (card) => this.isParticipatingNonKing(card)
            },
            handler: (context) => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);

                this.game.addMessage(
                    '{0} uses {1} to stand {2} and remove them from the challenge',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }

    isParticipatingInMilitaryChallenge() {
        return this.game.isDuringChallenge({ challengeType: 'military' }) && this.isParticipating();
    }

    isParticipatingNonKing(card) {
        return (
            card.location === 'play area' &&
            card.getType() === 'character' &&
            !card.hasTrait('King') &&
            card.isParticipating()
        );
    }

    numberOfLoyalChars() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return card.isLoyal() && card.getType() === 'character';
        });

        return cards.length;
    }
}

RobbStark.code = '04002';

export default RobbStark;
