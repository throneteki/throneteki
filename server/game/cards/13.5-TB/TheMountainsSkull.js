import DrawCard from '../../drawcard.js';

class TheMountainsSkull extends DrawCard {
    // The Mountain's Skull (13096)
    // Attached character gets +2 STR and gains renown.
    // Reaction: After an opponent's character with printed STR 6 or higher is killed, put The
    // Mountain's Skull into play from your hand or discard pile.
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
