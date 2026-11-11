import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class SansaStark extends DrawCard {
    // Sansa Stark (01147)
    // Sansa Stark enters play knelt.
    // Reaction: After Sansa Stark stands, gain 1 power for your faction. (Limit once per round.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetLocation: 'any',
            match: this,
            effect: ability.effects.entersPlayKneeled()
        });
        this.reaction({
            when: {
                onCardStood: (event, context) =>
                    event.card === context.source && context.player.canGainFactionPower()
            },
            limit: ability.limit.perRound(1),
            message: '{player} uses {source} to gain 1 power for their faction',
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: 1
            }))
        });
    }
}

SansaStark.code = '01147';

export default SansaStark;
