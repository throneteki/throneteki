const DrawCard = require('../../drawcard.js');

class BericDondarrion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens['kiss'])
        });

        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            cannotBeCanceled: true,
            handler: () => {
                this.modifyToken('kiss', 6);
                this.game.addMessage('{0} is forced to place 6 kiss tokens on {1}', this.controller, this);
            }
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave && event.cards.includes(this) && this.canBeSaved()
            },
            cost: ability.costs.discardTokenFromSelf('kiss'),
            handler: context => {
                context.event.saveCard(this);
                this.game.addMessage('{0} discards a kiss token to save {1}', this.controller, this);
            }
        });
    }
}

BericDondarrion.code = '06117';

module.exports = BericDondarrion;
