import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class KarstarkLancer extends DrawCard {
    // Karstark Lancer (25011)
    // Interrupt: When Karstark Lancer is sacrificed or killed, each player chooses a location they
    // control, if able. Each of those locations gains 1 power.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event, context) => event.card === context.source,
                onSacrificed: (event, context) => event.card === context.source
            },
            target: {
                activePromptTitle: 'Select a location',
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: {
                    type: 'location',
                    location: 'play area',
                    controller: 'choosingPlayer'
                },
                gameAction: GameActions.gainPower((context) => ({
                    card: context.target,
                    amount: 1
                }))
            },
            message:
                '{player} uses {source} to have each player choose a location they control to gain 1 power, if able'
        });
    }
}

KarstarkLancer.code = '25011';

export default KarstarkLancer;
