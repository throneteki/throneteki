import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class TheDornishmansWife extends DrawCard {
    // "The Dornishman's Wife" (17145)
    // Interrupt: When a unique character is killed:
    // - if it has a [military] icon, gain 2 gold.
    // - if it has an [intrigue] icon, draw 2 cards.
    // - if it has a [power] icon, it gains 2 power. (Max 1 per phase.)
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card.isUnique()
            },
            max: ability.limit.perPhase(1),
            message: '{player} plays {source} and {gameAction}',
            gameAction: GameActions.simultaneously((context) => [
                ...(context.event.card.hasIcon('military')
                    ? [GameActions.gainGold((context) => ({ player: context.player, amount: 2 }))]
                    : []),
                ...(context.event.card.hasIcon('intrigue')
                    ? [GameActions.drawCards((context) => ({ player: context.player, amount: 2 }))]
                    : []),
                ...(context.event.card.hasIcon('power')
                    ? [
                          GameActions.gainPower((context) => ({
                              card: context.event.card,
                              amount: 2
                          }))
                      ]
                    : [])
            ])
        });
    }
}

TheDornishmansWife.code = '17145';

export default TheDornishmansWife;
