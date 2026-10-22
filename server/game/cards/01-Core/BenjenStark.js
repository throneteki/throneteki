import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class BenjenStark extends DrawCard {
    // Benjen Stark (01122)
    // Each Ranger character you control cannot be bypassed by stealth.
    // Interrupt: When Benjen Stark is killed, gain 2 power for your faction. Then, shuffle him back
    // into your deck instead of placing him in your dead pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('Ranger'),
            effect: ability.effects.cannotBeBypassedByStealth()
        });
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source
            },
            message: '{player} uses {source} to gain 2 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 2
            })).then({
                message:
                    'Then {player} shuffles {source} back into their deck instead of placing it in their dead pile',
                gameAction: GameActions.replaceEvent((context) => ({
                    event: context.parentContext.event,
                    replacement: GameActions.placeCard({
                        card: context.source,
                        location: 'draw deck'
                    }).then({
                        gameAction: GameActions.shuffle((context) => ({ player: context.player }))
                    })
                }))
            })
        });
    }
}

BenjenStark.code = '01122';

export default BenjenStark;
