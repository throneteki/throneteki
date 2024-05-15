import DrawCard from '../../drawcard.js';

class TheMountainsSkull extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [ability.effects.modifyStrength(2), ability.effects.addKeyword('Renown')]
        });
        this.reaction({
            location: ['hand', 'discard pile'],
            when: {
                onCharacterKilled: (event) =>
                    event.card.controller !== this.controller &&
                    event.card.getPrintedStrength() >= 6 &&
                    this.controller.canPutIntoPlay(this)
            },
            handler: (context) => {
                context.player.putIntoPlay(this);
                this.game.addMessage('{0} uses {1} to put {1} into play.', context.player, this);
            }
        });
    }
}

TheMountainsSkull.code = '13096';

export default TheMountainsSkull;
