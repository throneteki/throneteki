const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Craster extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo(card => card.hasTrait('Omen'))
        });
        this.action({
            title: 'Sacrifice to resurrect',
            cost: ability.costs.sacrificeSelf(),
            condition: () => this.game.anyCardsInLog(log => this.killedInCurrentPhase(log)),
            handler: () => {
                let characters = this.game.filterCardsInLog(log => this.killedInCurrentPhase(log));
                _.each(characters, character => {
                    character.owner.putIntoPlay(character);
                });
                this.game.addMessage('{0} sacrifices {1} to put into play each character killed this phase', this.controller, this);
            }
        });
    }

    killedInCurrentPhase(log) {
        return (
            log.type === 'kill' &&
            log.round === this.game.round &&
            log.phase === this.game.currentPhase &&
            log.card.location === 'dead pile'
        );
    }
}

Craster.code = '04085';

module.exports = Craster;
