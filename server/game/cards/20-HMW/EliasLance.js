const DrawCard = require('../../drawcard.js');

class EliasLance extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentRestriction({ trait: 'Sand Snake' });

        this.whileAttached({
            match: card => card.name === 'Elia Sand',
            effect: ability.effects.addKeyword('Stealth')
        });

        this.reaction({
            when: {
                afterChallenge: event => event.challenge.loser === this.controller && this.parent.isAttacking()
            },
            handler: context => {
                this.game.promptForSelect(context.event.challenge.winner, {
                    activePromptTitle: 'Select a defending character',
                    source: this,
                    cardCondition: card => card.location === 'play area' &&
                        card.controller === context.event.challenge.winner &&
                        card.getType() === 'character' &&
                        card.isParticipating(),
                    onSelect: (player, card) => this.cardSelected(context, player, card)
                });
            }
        });
    }

    cardSelected(context, player, card) {
        context.event.challenge.winner.returnCardToHand(card);
        this.game.addMessage('{0} uses {1} to have {2} return {3} to their hand',
            this.controller, this, context.event.challenge.winner, card);

        return true;
    }
}

EliasLance.code = '20019';

module.exports = EliasLance;
