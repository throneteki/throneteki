import DrawCard from '../../drawcard.js';

class AllMenAreFools extends DrawCard {
    // All Men Are Fools (06004)
    // Reaction: After you win a challenge by 5 or more STR, each Lady character you control gains 1
    // power. (Max 1 per challenge.)
    setupCardAbilities(ability) {
        this.reaction({
            max: ability.limit.perChallenge(1),
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    event.challenge.strengthDifference >= 5 &&
                    this.hasLady()
            },
            handler: () => {
                let ladies = this.controller.filterCardsInPlay(
                    (card) => card.hasTrait('Lady') && card.getType() === 'character'
                );

                for (let card of ladies) {
                    card.modifyPower(1);
                }

                this.game.addMessage(
                    '{0} plays {1} to have {2} gain 1 power',
                    this.controller,
                    this,
                    ladies
                );
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

AllMenAreFools.code = '06004';

export default AllMenAreFools;
