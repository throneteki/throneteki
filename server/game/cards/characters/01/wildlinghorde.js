const DrawCard = require('../../../drawcard.js');

class WildlingHorde extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel your faction card',
            phase: 'challenge',
            cost: ability.costs.kneelFactionCard(),
            handler: (player) => {
                if(!this.game.currentChallenge) {
                    return false;
                }

                this.game.promptForSelect(player, {
                    activePromptTitle: 'Select a Wildling character',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => this.cardCondition(player, card),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    cardCondition(player, card) {
        var currentChallenge = this.game.currentChallenge;
        if(!currentChallenge) {
            return false;
        }

        return card.location === 'play area' && card.controller === player && card.hasTrait('Wildling') && currentChallenge.isParticipating(card);
    }

    onCardSelected(player, card) {
        if(this.controller !== player) {
            return false;
        }

        this.game.addMessage('{0} uses {1} to kneel their faction card and increase the strength of {2} by 2 until the end of the challenge', player, this, card);
        this.untilEndOfChallenge(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(2)
        }));

        return true;
    }
}

WildlingHorde.code = '01031';

module.exports = WildlingHorde;
