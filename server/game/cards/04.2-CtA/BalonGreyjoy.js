import DrawCard from '../../drawcard.js';

class BalonGreyjoy extends DrawCard {
    // Balon Greyjoy (04031)
    // Renown.
    // Balon Greyjoy does not kneel when declared as an attacker in a [military] challenge against
    // an opponent who does not control a King character.
    // Action: Kneel a [greyjoy] location to give each loyal character you control +1 STR until the
    // end of the challenge. (Limit once per challenge.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                return (
                    this.game.currentChallenge &&
                    !this.game.currentChallenge.defendingPlayer.anyCardsInPlay((card) =>
                        card.hasTrait('King')
                    )
                );
            },
            match: this,
            effect: [ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })]
        });

        this.action({
            title: 'Give loyal characters +1 STR',
            condition: () => this.game.currentChallenge,
            cost: ability.costs.kneel(
                (card) => card.isFaction('greyjoy') && card.getType() === 'location'
            ),
            limit: ability.limit.perChallenge(1),
            handler: (context) => {
                let loyalChars = this.controller.filterCardsInPlay(
                    (card) => card.isLoyal() && card.getType() === 'character'
                );
                this.untilEndOfChallenge((ability) => ({
                    match: loyalChars,
                    effect: ability.effects.modifyStrength(1)
                }));

                this.game.addMessage(
                    '{0} uses {1} and kneels {2} to give +1 STR to each loyal character they control until the end of the challenge',
                    this.controller,
                    this,
                    context.costs.kneel
                );
            }
        });
    }
}

BalonGreyjoy.code = '04031';

export default BalonGreyjoy;
