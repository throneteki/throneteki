import DrawCard from '../../drawcard.js';

class FacelessMan extends DrawCard {
    setupCardAbilities() {
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

                this.game.promptForIcon(this.controller, this, (icon) => {
                    this.lastingEffect((ability) => ({
                        condition: () => this.location === 'play area',
                        targetLocation: 'any',
                        targetController: 'any',
                        match: this,
                        effect: ability.effects.addIcon(icon)
                    }));
                    this.game.addMessage(
                        '{0} gives {1} {2} {3} icon',
                        this.controller,
                        this,
                        icon === 'intrigue' ? 'an' : 'a',
                        icon
                    );
                });
            }
        });
    }

    selectTraitName(player, traitName) {
        this.lastingEffect((ability) => ({
            condition: () => this.location === 'play area',
            targetLocation: 'any',
            targetController: 'any',
            match: this,
            effect: ability.effects.addTrait(traitName)
        }));

        this.game.addMessage('{0} gives {1} the {2} trait', player, this, traitName);

        return true;
    }
}

FacelessMan.code = '00368';

export default FacelessMan;
