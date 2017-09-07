const DrawCard = require('../../drawcard.js');

class SupportOfSaltcliffe extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('stealth')
        });

        this.reaction({
            when: {
                afterChallenge: event => this.controller === event.challenge.winner && event.challenge.isParticipating(this.parent) &&
                                         event.challenge.isUnopposed()
            },
            handler: () => {
                this.parent.controller.standCard(this.parent);
                this.game.addMessage('{0} uses {1} to stand {2}', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || !card.isFaction('greyjoy')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

SupportOfSaltcliffe.code = '00010';

module.exports = SupportOfSaltcliffe;
