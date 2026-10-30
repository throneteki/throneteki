import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DaenerysTargaryen extends DrawCard {
    // Daenerys Targaryen (25053)
    // Insight.
    // While you control Khal Drogo, he gains intimidate.
    // Reaction: After you win a challenge as the attacking player, gain 1 power for your faction
    // for each unique attacking Bloodrider character. (Limit once per phase.)
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.name === 'Khal Drogo' && card.controller === context.source.controller,
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                afterChallenge: (event, context) =>
                    event.challenge.attackingPlayer === context.source.controller &&
                    event.challenge.winner === context.source.controller
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to gain {amount} power for their faction',
                args: { amount: (context) => context.source.getNumberOfAttackingBloodriders() }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: context.source.getNumberOfAttackingBloodriders()
            }))
        });
    }

    getNumberOfAttackingBloodriders() {
        return this.controller.filterCardsInPlay(
            (card) =>
                card.isUnique() &&
                card.isAttacking() &&
                card.hasTrait('Bloodrider') &&
                card.getType() === 'character'
        ).length;
    }
}

DaenerysTargaryen.code = '25053';

export default DaenerysTargaryen;
