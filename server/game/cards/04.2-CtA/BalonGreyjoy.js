import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BalonGreyjoy extends DrawCard {
    // Balon Greyjoy (04031)
    // Renown.
    // Balon Greyjoy does not kneel when declared as an attacker in a [military] challenge against
    // an opponent who does not control a King character.
    // Action: Kneel a [greyjoy] location to give each loyal character you control +1 STR until the
    // end of the challenge. (Limit once per challenge.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => {
                return (
                    context.game.currentChallenge &&
                    !context.game.currentChallenge.defendingPlayer.anyCardsInPlay((card) =>
                        card.hasTrait('King')
                    )
                );
            },
            match: this,
            effect: [ability.effects.doesNotKneelAsAttacker({ challengeType: 'military' })]
        });

        this.action({
            title: 'Give loyal characters +1 STR',
            condition: (context) => context.game.currentChallenge,
            cost: ability.costs.kneel(
                (card) => card.isFaction('greyjoy') && card.getType() === 'location'
            ),
            limit: ability.limit.perChallenge(1),
            message:
                '{player} uses {source} and kneels {costs.kneel} to give +1 STR to each loyal character they control until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.player.filterCardsInPlay(
                    (card) => card.isLoyal() && card.getType() === 'character'
                ),
                effect: ability.effects.modifyStrength(1)
            }))
        });
    }
}

BalonGreyjoy.code = '04031';

export default BalonGreyjoy;
