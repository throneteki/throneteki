import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class RedRain extends DrawCard {
    // Nighttime Raid (12024)
    // Action: Choose up to 3 characters with pillage and/or the Raider trait. Until the end of the
    // phase, each of those characters gains stealth.
    setupCardAbilities(ability) {
        this.action({
            title: 'Give stealth',
            target: {
                mode: 'upTo',
                numCards: 3,
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    (card.hasKeyword('Pillage') || card.hasTrait('Raider'))
            },
            message:
                '{player} plays {source} to have {target} gain stealth until the end of the phase',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfPhase',
                match: context.target,
                effect: ability.effects.addKeyword('Stealth')
            }))
        });
    }
}

RedRain.code = '12024';

export default RedRain;
