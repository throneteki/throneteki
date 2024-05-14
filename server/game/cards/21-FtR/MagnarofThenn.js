import DrawCard from '../../drawcard.js';

class MagnarofThenn extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Wildling', unique: true });
        this.whileAttached({
            effect: [ability.effects.addKeyword('pillage'), ability.effects.addTrait('Lord')]
        });

        this.interrupt({
            canCancel: true,
            when: {
                onCharacterKilled: (event) =>
                    event.card === this.parent && this.parent.canBeSaved() && event.allowSave
            },
            cost: ability.costs.sacrifice(
                (card) =>
                    card.hasTrait('Wildling') &&
                    card.getType() === 'character' &&
                    card !== this.parent
            ),
            handler: (context) => {
                let parent = context.cardStateWhenInitiated.parent;
                context.event.saveCard();
                this.game.addMessage(
                    '{0} uses {1} and sacrifices {2} to save {3}',
                    context.player,
                    this,
                    context.costs.sacrifice,
                    parent
                );
            }
        });
    }
}

MagnarofThenn.code = '21028';

export default MagnarofThenn;
