import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) =>
                card.name === 'Ser Barristan Selmy' && card.controller === this.controller,
            effect: ability.effects.addKeyword('intimidate')
        });
        this.reaction({
            when: {
                afterChallenge: (event) =>
                    event.challenge.attackingPlayer === this.controller &&
                    event.challenge.winner === this.controller
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to gain {amount} power for their faction',
                args: { amount: () => this.getNumberOfAttackingMercenaries() }
            },
            gameAction: GameActions.gainPower((context) => ({
                card: context.player.faction,
                amount: this.getNumberOfAttackingMercenaries()
            }))
        });
    }

    getNumberOfAttackingMercenaries() {
        return this.controller.filterCardsInPlay(
            (card) =>
                card.isUnique() &&
                card.isAttacking() &&
                card.hasTrait('Mercenary') &&
                card.getType() === 'character'
        ).length;
    }
}

DaenerysTargaryen.code = '00247';

export default DaenerysTargaryen;
