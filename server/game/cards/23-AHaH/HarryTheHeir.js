import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class HarryTheHeir extends DrawCard {
    // Harry the Heir (23021)
    // While you control Anya Waynwood, she gets +1 STR for each power Harry the Heir has.
    // Reaction: After you win a challenge in which Harry the Heir is attacking, choose and stand a
    // neutral location you control. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.name === 'Anya Waynwood' && card.controller === context.source.controller,
            effect: ability.effects.dynamicStrength((card, context) => context.source.power)
        });

        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    context.source.isAttacking() &&
                    event.challenge.isMatch({ winner: context.source.controller })
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
            gameAction: GameActions.standCard((context) => ({
                card: context.target
            }))
        });
    }
}

HarryTheHeir.code = '23021';

export default HarryTheHeir;
