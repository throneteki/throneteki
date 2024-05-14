import DrawCard from '../../drawcard.js';

class AnguyTheArcher extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () =>
                !this.controller.anyCardsInPlay(
                    (card) => card.getType() === 'character' && card.isLoyal()
                ),
            match: this,
            effect: [
                ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' }),
                ability.effects.doesNotKneelAsDefender({ challengeType: 'military' })
            ]
        });
    }
}

AnguyTheArcher.code = '14041';

export default AnguyTheArcher;
