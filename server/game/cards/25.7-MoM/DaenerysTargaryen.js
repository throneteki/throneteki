const GameActions = require('../../GameActions/index.js');
const DrawCard = require('../../drawcard.js');

class DaenerysTargaryen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.name === 'Khal Drogo' && card.controller === this.controller,
            effect: ability.effects.addKeyword('intimidate')
        });
        this.persistentEffect({
            condition: () => this.controller.anyCardsInPlay(card => card.hasTrait('Companion') && card.getType() === 'character'),
            match: this,
            effect: ability.effects.addKeyword('insight')
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller
            },
            limit: ability.limit.perPhase(1),
            message: {
                format: '{player} uses {source} to gain {amount} power for their faction',
                args: { amount: () => this.getNumberOfAttackingBloodriders() }
            },
            gameAction: GameActions.gainPower(context => ({ card: context.player.faction, amount: this.getNumberOfAttackingBloodriders() }))
        });
    }

    getNumberOfAttackingBloodriders() {
        return this.controller.filterCardsInPlay(card => card.isUnique() && card.isAttacking() && card.hasTrait('Bloodrider') && card.getType() === 'character').length;
    }
}

DaenerysTargaryen.code = '25574';
DaenerysTargaryen.version = '1.0';

module.exports = DaenerysTargaryen;
