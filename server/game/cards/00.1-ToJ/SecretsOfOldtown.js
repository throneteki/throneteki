import PlotCard from '../../plotcard.js';

class SecretsOfOldtown extends PlotCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give an icon or trait',
            target: {
                cardCondition: (card) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.controller === this.controller
            },
            limit: ability.limit.perRound(1),
            handler: (context) => {
                this.context = context;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Give trait', method: 'promptForTrait' },
                            { text: 'Give icon', method: 'promptForIcon' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    promptForIcon() {
        this.game.promptForIcon(this.controller, this, (icon) => {
            this.untilEndOfPhase((ability) => ({
                match: this.context.target,
                effect: ability.effects.addIcon(icon)
            }));

            this.game.addMessage(
                '{0} uses {1} to have {2} gain {3} {4} icon',
                this.controller,
                this,
                this.context.target,
                icon === 'intrigue' ? 'an' : 'a',
                icon
            );
        });

        return true;
    }

    promptForTrait() {
        this.game.promptWithMenu(this.context.player, this, {
            activePrompt: {
                menuTitle: 'Name a trait',
                controls: [{ type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }]
            },
            source: this
        });

        return true;
    }

    selectTraitName(player, traitName) {
        this.untilEndOfPhase((ability) => ({
            match: this.context.target,
            effect: ability.effects.addTrait(traitName)
        }));

        this.game.addMessage(
            '{0} uses {1} to give {2} the {3} trait',
            player,
            this,
            this.context.target,
            traitName
        );

        return true;
    }
}

SecretsOfOldtown.code = '00381';

export default SecretsOfOldtown;
