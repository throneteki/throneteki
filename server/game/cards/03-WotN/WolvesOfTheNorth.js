import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class WolvesOfTheNorth extends DrawCard {
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
