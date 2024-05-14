import DrawCard from '../../drawcard.js';

class RobbStark extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCharacterKilled: (event) =>
                    this.isStarkCharacter(event.cardStateWhenKilled) && this.canChangeGameState(),
                onSacrificed: (event) =>
                    this.isStarkCharacter(event.cardStateWhenSacrificed) &&
                    this.canChangeGameState()
            },
            limit: ability.limit.perRound(1),
            handler: () => {
                let characters = this.controller.filterCardsInPlay(
                    (card) => card.getType() === 'character'
                );
                characters.forEach((card) => card.controller.standCard(card));
                this.game.addMessage(
                    '{0} uses {1} to stand each {2} character they control',
                    this.controller,
                    this,
                    'stark'
                );
            }
        });
    }

    isStarkCharacter(card) {
        return (
            card.controller === this.controller &&
            card.isFaction('stark') &&
            card.getType() === 'character'
        );
    }

    canChangeGameState() {
        return this.controller.anyCardsInPlay(
            (card) => card.getType() === 'character' && card.kneeled
        );
    }
}

RobbStark.code = '01146';

export default RobbStark;
