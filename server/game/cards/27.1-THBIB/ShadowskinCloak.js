import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class ShadowskinCloak extends DrawCard {
    // Shadowskin Cloak (27018)
    // Shadow (0).
    // Attached character gains stealth.
    // Forced Interrupt: When the challenges phase ends, return Shadowskin Cloak to your hand.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });
        this.forcedInterrupt({
            when: {
                onPhaseEnded: (event) => event.phase === 'challenge'
            },
            message: '{player} is forced to return {source} to their hand',
            gameAction: GameActions.returnCardToHand((context) => ({ card: context.source }))
        });
    }
}

ShadowskinCloak.code = '27018';

export default ShadowskinCloak;
