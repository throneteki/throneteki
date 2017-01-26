const _ = require('underscore');
const DrawCard = require('../../../drawcard.js');

class MotherOfDragons extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onAttackersDeclared: (event, challenge) => !this.kneeled && this.controller === challenge.attackingPlayer &&_.any(challenge.attackers, card => {
                    return card.hasTrait('Dragon');
                })
                
            },
            handler: () => {
                var challenge = this.game.currentChallenge;
                this.controller.kneelCard(this);
                challenge.addAttacker(this.parent);
                this.game.addMessage('{0} uses {1} to add {2} to the challenge as an attacker', this.controller, this, this.parent);
            }
        });

        this.reaction({
            when: {
                onDefendersDeclared: (event, challenge) => !this.kneeled && this.controller === challenge.defendingPlayer &&_.any(challenge.defenders, card => {
                    return card.hasTrait('Dragon');
                })
                
            },
            handler: () => {
                var challenge = this.game.currentChallenge;
                this.controller.kneelCard(this);
                challenge.addDefender(this.parent);
                this.game.addMessage('{0} uses {1} to add {2} to the challenge as a defender', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('Stormborn')) {
            return false;
        }

        return super.canAttach(player, card);

    }       
}

MotherOfDragons.code = '04094';

module.exports = MotherOfDragons;
