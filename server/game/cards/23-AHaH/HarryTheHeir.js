import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HarryTheHeir extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.name === 'Anya Waynwood' && card.controller === this.controller,
            effect: ability.effects.dynamicStrength(() => this.power)
        });

        this.reaction({
            when: {
                afterChallenge: (event) =>
                    this.isAttacking() && event.challenge.isMatch({ winner: this.controller })
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: {
                    location: 'play area',
                    kneeled: true,
                    type: 'location',
                    faction: 'neutral',
                    controller: 'current'
                }
            },
            message: '{player} uses {source} to stand {target}',
            limit: ability.limit.perPhase(1),
            handler: (context) => {
                this.game.resolveGameAction(
                    GameActions.standCard((context) => ({
                        card: context.target
                    })),
                    context
                );
            }
        });
    }
}

HarryTheHeir.code = '23021';

export default HarryTheHeir;
