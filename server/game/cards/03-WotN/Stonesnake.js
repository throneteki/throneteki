import DrawCard from '../../drawcard.js';

class Stonesnake extends DrawCard {
    // Stonesnake (03033)
    // Stealth.
    // Reaction: After Stonesnake bypasses a character using stealth, choose one of that character's
    // keywords. Stonesnake gains that keyword until the end of the phase.
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event) =>
                    event.source === this && this.hasCopyableKeyword(event.target)
            },
            handler: (context) => {
                const keywords = context.event.target.getKeywords();
                let buttons = keywords.map((keyword) => ({
                    text: keyword,
                    method: 'keywordSelected',
                    arg: keyword.toLowerCase()
                }));

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
            match: this,
            effect: ability.effects.addKeyword(keyword)
        }));

        this.game.addMessage(
            '{0} uses {1} to have {1} gain {2} until the end of the phase',
            this.controller,
            this,
            keyword
        );

        return true;
    }

    hasCopyableKeyword(card) {
        return card.getKeywords().length > 0;
    }
}

Stonesnake.code = '03033';

export default Stonesnake;
