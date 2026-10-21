import DrawCard from '../../drawcard.js';

class MaceTyrell extends DrawCard {
    // Mace Tyrell (17136)
    // Reaction: After a unique [tyrell] character enters play under your control, pay 1 gold to
    // have that character gain 1 power. (Limit once per phase.)
    // Action: Kneel your faction card to remove another [tyrell] character you control from the
    // game until the beginning of the next phase.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event) =>
                    event.card.isFaction('tyrell') &&
                    event.card.getType() === 'character' &&
                    event.card.isUnique() &&
                    event.card.controller === this.controller &&
                    event.card.allowGameAction('gainPower')
            },
            limit: ability.limit.perPhase(1),
            cost: ability.costs.payGold(1),
            handler: (context) => {
                context.event.card.modifyPower(1);
                this.game.addMessage(
                    '{0} uses {1} and pays 1 gold to have {2} gain 1 power',
                    this.controller,
                    this,
                    context.event.card
                );
            }
        });

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

MaceTyrell.code = '17136';

export default MaceTyrell;
