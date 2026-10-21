import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class KarstarkLancer extends DrawCard {
    // Karstark Lancer (25011)
    // Interrupt: When Karstark Lancer is sacrificed or killed, each player chooses a location they
    // control, if able. Each of those locations gains 1 power.
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: (event) => event.card === this,
                onSacrificed: (event) => event.card === this
            },
            target: {
                activePromptTitle: 'Select a location',
                choosingPlayer: 'each',
                ifAble: true,
                cardCondition: {
                    type: 'location',
                    location: 'play area',
                    controller: 'choosingPlayer',
                    condition: (card) => GameActions.gainPower({ card, amount: 1 }).allow()
                }
            },
            message:
                '{player} uses {source} to have each player choose a location they control to gain 1 power, if able',
            handler: (context) => {
                context.game.resolveGameAction(
                    GameActions.simultaneously((context) =>
                        context.targets
                            .getTargets()
                            .map((card) => GameActions.gainPower({ card, amount: 1 }))
                    ),
                    context
                );
            }
        });
    }
}

KarstarkLancer.code = '25011';

export default KarstarkLancer;
