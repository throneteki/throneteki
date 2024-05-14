import DrawCard from '../../drawcard.js';

class LadySansasRose extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.winner === this.controller &&
                    this.hasSingleParticipatingChar() &&
                    this.hasParticipatingKnight()
            },
            max: ability.limit.perChallenge(1),
            handler: (context) => {
                let power = this.hasLadyCharacter() ? 3 : 1;
                let participatingCard = this.controller.filterCardsInPlay((card) => {
                    return (
                        card.isParticipating() &&
                        card.hasTrait('Knight') &&
                        card.getType() === 'character'
                    );
                });
                participatingCard[0].modifyPower(power);
                this.game.addMessage(
                    '{0} plays {1} to have {2} gain {3} power',
                    context.player,
                    this,
                    participatingCard[0],
                    power
                );
            }
        });
    }

    hasSingleParticipatingChar() {
        if (this.game.currentChallenge.attackingPlayer === this.controller) {
            return this.game.currentChallenge.attackers.length === 1;
        }
        return this.game.currentChallenge.defenders.length === 1;
    }

    hasParticipatingKnight() {
        let cards = this.controller.filterCardsInPlay((card) => {
            return (
                card.isParticipating() && card.hasTrait('Knight') && card.getType() === 'character'
            );
        });

        return !!cards.length;
    }

    hasLadyCharacter() {
        return this.controller.anyCardsInPlay(
            (card) => card.hasTrait('Lady') && card.getType() === 'character'
        );
    }
}

LadySansasRose.code = '02024';

export default LadySansasRose;
