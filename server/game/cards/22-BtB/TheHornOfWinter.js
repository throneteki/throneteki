const DrawCard = require('../../drawcard.js');

class TheHornOfWinter extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ unique: true });
        this.whileAttached({
            effect: ability.effects.addKeyword('Assault')
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller
            },
            target: {
                activePromptTitle: 'Select a location',
                cardCondition: card => card.location === 'play area' && card.getType() === 'location' && card.targetedByAssault
            },
            cost: ability.costs.sacrificeSelf(),
            handler: context => {
                this.assaulted = context.target;

                if(context.target.hasTrait('Stronghold') || context.target.name === 'The Wall') {
                    let buttons = [
                        { text: 'Treat as blank', method: 'treatAsBlank' },
                        { text: 'Discard from play', method: 'discardFromPlay' }
                    ];

                    this.game.promptWithMenu(context.player, this, {
                        activePrompt: {
                            menuTitle: 'Discard from play?',
                            buttons: buttons
                        },
                        source: this
                    });
                } else {
                    this.treatAsBlank(context.player);
                }
            }
        });
    }

    treatAsBlank(player) {
        this.untilEndOfRound(ability => ({
            match: this.assaulted,
            effect: ability.effects.blankExcludingTraits
        }));

        this.game.addMessage('{0} sacrifices {1} to treat the text box of {2} as blank until the end of the round',
            player, this, this.assaulted);

        return true;
    }

    discardFromPlay(player) {
        this.assaulted.controller.discardCard(this.assaulted);

        this.game.addMessage('{0} sacrifices {1} to discard {2} from play',
            player, this, this.assaulted);

        return true;
    }
}

TheHornOfWinter.code = '22027';

module.exports = TheHornOfWinter;
