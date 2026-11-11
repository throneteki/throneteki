import DrawCard from '../../drawcard.js';

class AnguyTheArcher extends DrawCard {
    // Anguy the Archer (14041)
    // While you control no loyal characters, Anguy the Archer does not kneel when declared as an
    // attacker or defender in a [military] challenge.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) =>
                !context.source.controller.anyCardsInPlay(
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
