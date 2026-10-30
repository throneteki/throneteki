import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MoonBrothers extends DrawCard {
    // Moon Brothers (05011)
    // Action: During a challenge in which you control an attacking Clansman character, kneel your
    // faction card to put Moon Brothers into play from your hand (standing), participating as an
    // attacker.
    setupCardAbilities(ability) {
        this.action({
            title: 'Add as an attacker',
            location: 'hand',
            condition: (context) =>
                context.game.isDuringChallenge({ attackingPlayer: context.player }) &&
                context.player.anyCardsInPlay(
                    (card) =>
                        card.hasTrait('Clansman') &&
                        card.getType() === 'character' &&
                        card.isAttacking()
                ),
            cost: ability.costs.kneelFactionCard(),
            message:
                '{player} kneels their faction card to put {source} into play participating as an attacker',
            gameAction: GameActions.putIntoPlay((context) => ({
                player: context.player,
                card: context.source
            })).then({
                gameAction: GameActions.addToChallenge((context) => ({
                    card: context.source,
                    player: context.player
                }))
            })
        });
    }
}

MoonBrothers.code = '05011';

export default MoonBrothers;
