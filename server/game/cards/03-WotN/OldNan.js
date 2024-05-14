import DrawCard from '../../drawcard.js';

class OldNan extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onPlotsRevealed: () => true
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                let buttons = context.event.plots.map((plot) => {
                    return { method: 'plotSelected', card: plot, mapCard: true };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select plot to modify',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    plotSelected(player, card) {
        if (this.controller !== player) {
            return false;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select trait to add',
                buttons: [
                    { text: 'Winter', method: 'traitSelected', arg: 'Winter' },
                    { text: 'Summer', method: 'traitSelected', arg: 'Summer' }
                ]
            },
            source: this
        });

        this.selectedCard = card;

        return true;
    }

    traitSelected(player, trait) {
        let plotCard = this.selectedCard;
        if (!plotCard) {
            return false;
        }

        let lowerTrait = trait.toLowerCase();
        if (lowerTrait !== 'summer' && lowerTrait !== 'winter') {
            return false;
        }

        this.untilEndOfRound((ability) => ({
            match: plotCard,
            effect: ability.effects.addTrait(trait)
        }));

        this.game.addMessage(
            '{0} uses {1} to add the {2} trait to {3}',
            player,
            this,
            trait,
            plotCard
        );

        return true;
    }
}

OldNan.code = '03010';

export default OldNan;
