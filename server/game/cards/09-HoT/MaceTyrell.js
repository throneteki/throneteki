import DrawCard from '../../drawcard.js';
import GameActions from '../../GameActions/index.js';

class MaceTyrell extends DrawCard {
    // Mace Tyrell (09001)
    // Reaction: After a [tyrell] character enters play under your control, pay 1 gold to have Mace
    // Tyrell gain 1 power. (Limit once per phase.)
    // Action: Kneel your faction card to remove another [tyrell] character you control from the
    // game until the beginning of the next phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card.isFaction('tyrell') &&
                    event.card.getType() === 'character' &&
                    event.card.controller === context.source.controller &&
                    context.source.allowGameAction('gainPower')
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.payGold(1),
            message: '{player} pays 1 gold to gain 1 power on {source}',
            gameAction: GameActions.gainPower((context) => ({ card: context.source, amount: 1 }))
        });

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

MaceTyrell.code = '09001';

export default MaceTyrell;
