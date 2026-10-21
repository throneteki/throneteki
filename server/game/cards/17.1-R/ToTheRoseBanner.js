import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class ToTheRoseBanner extends DrawCard {
    // To the Rose Banner! (17141)
    // Action: Kneel your faction card to remove a [tyrell] character you control from the game
    // until the beginning of the next phase.
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from game',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card !== context.source &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character'
            },
            message:
                '{player} uses {source} and kneels their faction card to remove {target} from the game',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onPhaseStarted: () => true
                },
                match: context.target,
                targetLocation: ['play area', 'out of game'],
                effect: ability.effects.removeFromGame()
            }))
        });
    }
}

ToTheRoseBanner.code = '17141';

export default ToTheRoseBanner;
