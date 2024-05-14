import DrawCard from '../../drawcard.js';

class ToTheRoseBanner extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove character from game',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card !== this &&
                    card.isFaction('tyrell') &&
                    card.getType() === 'character'
            },
            handler: (context) => {
                this.lastingEffect((ability) => ({
                    until: {
                        onPhaseStarted: () => true
                    },
                    match: context.target,
                    targetLocation: ['play area', 'out of game'],
                    effect: ability.effects.removeFromGame()
                }));
                this.game.addMessage(
                    '{0} uses {1} and kneels their faction card to remove {2} from the game',
                    this.controller,
                    this,
                    context.target
                );
            }
        });
    }
}

ToTheRoseBanner.code = '17141';

export default ToTheRoseBanner;
