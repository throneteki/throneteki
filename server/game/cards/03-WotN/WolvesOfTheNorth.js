import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WolvesOfTheNorth extends DrawCard {
    // Wolves of the North (03006)
    // No attachments. Stealth.
    // Reaction: After Wolves of the North bypasses a character using stealth, that character gets
    // -X STR until the end of the phase. X is the number of Direwolf cards you control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBypassedByStealth: (event) => event.source === this
            },
            message: {
                format: '{player} uses {source} to give {character} -{amount} STR until the end of the phase',
                args: {
                    character: (context) => context.event.target,
                    amount: (context) => this.direwolfCount(context.player)
                }
            },
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.event.target,
                effect: ability.effects.modifyStrength(-this.direwolfCount(context.player))
            }))
        });
    }

    direwolfCount(player) {
        return player.getNumberOfCardsInPlay((card) => card.hasTrait('Direwolf'));
    }
}

WolvesOfTheNorth.code = '03006';

export default WolvesOfTheNorth;
