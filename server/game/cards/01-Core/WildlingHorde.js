import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class WildlingHorde extends DrawCard {
    // Wildling Horde (01031)
    // No attachments. Pillage.
    // Challenges Action: Kneel your faction card to choose a participating Wildling character you
    // control. Until the end of the challenge, that character gets +2 STR.
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel your faction card',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.controller === context.source.controller &&
                    card.hasTrait('Wildling') &&
                    card.isParticipating()
            },
            message:
                '{player} uses {source} to kneel their faction card and increase the strength of {target} by 2 until the end of the challenge',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'untilEndOfChallenge',
                match: context.target,
                effect: ability.effects.modifyStrength(2)
            }))
        });
    }
}

WildlingHorde.code = '01031';

export default WildlingHorde;
