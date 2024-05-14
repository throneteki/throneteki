import DrawCard from '../../drawcard.js';

class WildlingHorde extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel your faction card',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.controller === this.controller &&
                    card.hasTrait('Wildling') &&
                    card.isParticipating()
            },
            handler: (context) => {
                this.game.addMessage(
                    '{0} uses {1} to kneel their faction card and increase the strength of {2} by 2 until the end of the challenge',
                    this.controller,
                    this,
                    context.target
                );
                this.untilEndOfChallenge((ability) => ({
                    match: context.target,
                    effect: ability.effects.modifyStrength(2)
                }));
            }
        });
    }
}

WildlingHorde.code = '01031';

export default WildlingHorde;
