const DrawCard = require('../../../drawcard.js');

class BericDondarrion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.dynamicStrength(() => this.tokens['kiss'])
        });

        //TODO: needs an ability flag preventing it from being cancellable
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                this.addToken('kiss', 6);
                this.game.addMessage('{0} is forced to place 6 kiss tokens on {1}', this.controller, this);
            }
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave && event.cards.includes(this)
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
