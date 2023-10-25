const DrawCard = require('../../drawcard.js');

class VultureKing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addKeyword('pillage')
        });
        this.reaction({
            when: {
                afterChallenge: event => event.challenge.winner === this.controller && this.parent && this.parent.isParticipating()
            },
            cost: ability.costs.discardFromDeck(),
            target: {
                cardCondition: (card, context) => card.location === 'play area' && card.getType() === 'character' && card.controller === context.event.challenge.loser
            },
            message: '{player} uses {source} and discards {costs.discardFromDeck} from their deck to have {target} lose a challenge icon until the end of the phase',
            handler: context => {
                this.game.promptForIcon(context.player, this, icon => {
                    this.untilEndOfPhase(ability => ({
                        match: context.target,
                        effect: ability.effects.removeIcon(icon)
                    }));
                    
                    this.game.addMessage('{0} uses {1} to have {2} lose {3} {4} icon until the end of the phase',
                        context.player, context.source, context.target, icon === 'intrigue' ? 'an' : 'a', icon);
                });
            }
        });
    }
}

VultureKing.code = '25546';
VultureKing.version = '1.2';

module.exports = VultureKing;
