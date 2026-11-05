import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class Kingslayer extends DrawCard {
    // Kingslayer (08030)
    // Kingsguard character only. Terminal.
    // Action: Kneel attached character to choose and kill a character with 2 or more power. (Limit
    // once per game.)
    // Forced Interrupt: When attached character leaves play, each opponent gains 2 power for his or
    // her faction.
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Kingsguard' });
        this.action({
            title: 'Kill character',
            limit: ability.limit.perGame(1),
            cost: ability.costs.kneelParent(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getPower() >= 2,
                gameAction: 'kill'
            },
            message: {
                format: '{player} uses {source} and kneels {parent} to kill {target}',
                args: { parent: (context) => context.source.parent }
            },
            gameAction: GameActions.kill((context) => ({ card: context.target }))
        });
        this.forcedInterrupt({
            when: {
                onCardLeftPlay: (event, context) => event.card === context.source.parent
            },
            message:
                '{player} is forced by {source} to have each opponent gain 2 power for their faction',
            gameAction: GameActions.simultaneously((context) =>
                context.game
                    .getOpponents(context.player)
                    .map((opponent) => GameActions.gainPower({ card: opponent.faction, amount: 2 }))
            )
        });
    }
}

Kingslayer.code = '08030';

export default Kingslayer;
