import DrawCard from '../../drawcard.js';

class FaceMask extends DrawCard {
    setupCardAbilities() {
        this.attachmentRestriction({ controller: 'current' });
        this.reaction({
            when: {
                onCardEntersPlay: (event) => event.card === this
            },
            handler: (context) => {
                this.context = context;

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Name a trait',
                        controls: [
                            { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    selectTraitName(player, traitName) {
        this.lastingEffect((ability) => ({
            condition: () => this.location === 'play area',
            targetLocation: 'any',
            targetController: 'any',
            match: (card) => card === this.parent,
            effect: ability.effects.addTrait(traitName)
        }));

        this.game.addMessage(
            '{0} uses {1} to give {2} the {3} trait',
            player,
            this,
            this.parent,
            traitName
        );

        return true;
    }
}

FaceMask.code = '00357';

export default FaceMask;
