const DrawCard = require('../../drawcard.js');
const TextHelper = require('../../TextHelper');

class BranStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.hasTrait('Old Gods') && card.controller === this.controller,
            effect: ability.effects.cannotBeKneeled(context => context.resolutionStage === 'effect')
        });
        this.interrupt({
            when: {
                onClaimApplied: event => event.challenge.isMatch({ challengeType: 'intrigue' }) 
                                            && event.challenge.loser.hand.length !== 0
                                            && event.challenge.getParticipants().some(card => card.controller === this.controller && card.hasTrait('Old Gods'))
            },
            handler: context => {
                let losingPlayer = this.game.currentChallenge.loser;
                let xValue = Math.min(this.game.currentChallenge.winner.getClaim(), losingPlayer.hand.length);
                context.replaceHandler(() => {
                    this.game.addMessage('{0} uses {1} to look at {2}\'s hand', context.player, this, losingPlayer);
                    this.game.promptForSelect(context.player, {
                        mode: 'exactly',
                        activePromptTitle: `Select ${TextHelper.count(xValue, 'card')}`,
                        numCards: xValue,
                        source: this,
                        revealTargets: true,
                        cardCondition: card => card.location === 'hand' && card.controller === losingPlayer,
                        onSelect: (player, cards) => this.cardsSelected(player, losingPlayer, cards)
                    });
                });
            }
        });
    }

    cardsSelected(player, losingPlayer, cards) {
        losingPlayer.discardCards(cards);
        this.game.addMessage('{0} then uses {1} to discard {2} from {3}\'s hand instead of the normal claim effects', player, this, cards, losingPlayer);
        return true;
    }
}

BranStark.code = '22016';

module.exports = BranStark;
