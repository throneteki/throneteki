const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

const keywords = ['Insight', 'Intimidate', 'Pillage', 'Renown'];

class Stonesnake extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event, challenge, source, target) => {
                    if(source !== this || this.hasNoCopyableKeyword(target)) {
                        return false;
                    }
                    this.bypassed = target;
                    return true;
                }
            },
            handler: () => {
                let buttons = [];

                _.each(keywords, keyword => {
                    if(this.bypassed.hasKeyword(keyword)) {
                        buttons.push({ text: keyword, method: 'keywordSelected', arg: keyword.toLowerCase() });
                    }
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
        this.untilEndOfPhase(ability => ({
            match: this,
            effect: ability.effects.addKeyword(keyword)
        }));

        this.game.addMessage('{0} uses {1} to have {1} gain {2} until the end of the phase', 
                              this.controller, this, keyword);

        return true;
    }

    hasNoCopyableKeyword(card) {
        return !_.any(keywords, keyword => card.hasKeyword(keyword));
    }
}

Stonesnake.code = '03033';

module.exports = Stonesnake;
