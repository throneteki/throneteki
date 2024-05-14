import DrawCard from '../../drawcard.js';

class SupportOfHarlaw extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give keyword to parent',
            phase: 'challenge',
            cost: ability.costs.kneel(
                (card) => card.hasTrait('Warship') && card.getType() === 'location'
            ),
            handler: (context) => {
                this.context = context;

                let buttons = [];
                let keywords = ['Pillage', 'Renown', 'Stealth'];

                keywords.map((keyword) => {
                    buttons.push({
                        text: keyword,
                        method: 'keywordSelected',
                        arg: keyword.toLowerCase()
                    });
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select a keyword',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    keywordSelected(player, keyword) {
        this.untilEndOfPhase((ability) => ({
            match: this.parent,
            effect: ability.effects.addKeyword(keyword)
        }));

        this.game.addMessage(
            '{0} uses {1} and kneels {2} to have {3} gain {4} until the end of the phase',
            player,
            this,
            this.context.costs.kneel,
            this.parent,
            keyword
        );

        return true;
    }
}

SupportOfHarlaw.code = '08072';

export default SupportOfHarlaw;
