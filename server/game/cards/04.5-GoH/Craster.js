const DrawCard = require('../../drawcard');
const KillTracker = require('../../EventTrackers/KillTracker');

class Craster extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);
        this.tracker = new KillTracker(this.game);
    }

    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.immuneTo((card) => card.hasTrait('Omen'))
        });
        this.action({
            title: 'Sacrifice to resurrect',
            cost: ability.costs.sacrificeSelf(),
            condition: () => this.tracker.anyKilledThisPhase(),
            handler: (context) => {
                let characters = this.tracker.getCardsKilledThisPhase(
                    (card) => card.location === 'dead pile'
                );
                for (let character of characters) {
                    character.owner.putIntoPlay(character);
                }
                this.game.addMessage(
                    '{0} sacrifices {1} to put into play each character killed this phase',
                    context.player,
                    this
                );
            }
        });
    }
}

Craster.code = '04085';

module.exports = Craster;
